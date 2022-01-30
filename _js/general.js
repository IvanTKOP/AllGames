// ---------- FUNCIONES GENERALES ----------

function notificarUsuario(texto) {
    alert(texto);
}

function llamadaAjax(url, parametros, manejadorOK, manejadorError) {
    var request = new XMLHttpRequest();

    request.open("POST", url);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (request.status == 200) {
                manejadorOK(request.responseText);
            } else {
                if (manejadorError != null) manejadorError(request.responseText);
            }
        }
    };

    request.send(parametros);
}

function objetoAParametrosParaRequest(objeto) {
    // Esto convierte un objeto JS en un listado de clave1=valor1&clave2=valor2&clave3=valor3
    return new URLSearchParams(objeto).toString();
}

function toast(texto){
    var list = document.getElementById("toast");
    list.classList.add("show");
    list.innerHTML = texto;
    setTimeout(function(){
    list.classList.remove("show");
    },3000);
}


function comprobarSesionIniciada(){
    llamadaAjax("../_php/ComprobarSesionIniciada.php", "", 
        function(texto){
            var sesionIniciada = JSON.parse(texto);
            if(!sesionIniciada){
                window.location ="../_php/CerrarSesion.php";
            }
        }, function(texto) {
            notificarUsuario("Error Ajax al comprobar sesión: " + texto);
        }
    );
}