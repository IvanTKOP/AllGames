// ----------------------------------- INICIO SESIÓN ------------------------------------------

window.onpaint =  comprobarSesionIniciada(); // inicia antes que window.onload 
window.onload = inicializar;




// ---------- VARIABLES GLOBALES ----------

var formulario;


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

// ---------- MANEJADORES DE EVENTOS / COMUNICACIÓN CON PHP ----------

function inicializar() {
    formulario = document.getElementById("formulario");

    document.getElementById("btnIniciarSesion").addEventListener("click", function () {
        domCrearFormulario("login");
    });
    document.getElementById("btnRegistrarse").addEventListener("click", function () {
        domCrearFormulario("register");
    });

    domCrearFormulario("login");
}

function comprobarSesionIniciada(){
    llamadaAjax("../_php/ComprobarSesionIniciada.php", "", 
        function(texto){
            var sesionIniciada = JSON.parse(texto);

            if(sesionIniciada){
                window.location ="../_html/index.html";
            }
        }, function(texto) {
            notificarUsuario("Error Ajax al comprobar sesión: " + texto);
        }
    );
}

function iniciarSesion(identificador, contrasenna, recuerdame){
    var recuerdameValue;

    if(recuerdame.checked) {
        recuerdameValue = "true";
    } else { // tambien para cuando viene "false" de registrarUsuario
        recuerdameValue = "false";
    }

    llamadaAjax("../_php/IniciarSesion.php", "identificador="+identificador.value+"&contrasenna="+contrasenna.value+"&recuerdame="+recuerdameValue,
        function(texto) {
            var sesionIniciada = JSON.parse(texto);

            if(!sesionIniciada){
                alert("Error al iniciar sesión")
            }else{
                alert("Sesión iniciada correctamente")
                window.location= "../_html/index.html";
            }
            
        }, function (texto){
            notificarUsuario("Error Ajax al iniciar sesión: " + texto);
        }
    );
}

function registrarUsuario(nombre, apellidos, identificador, email, contrasenna){
    llamadaAjax("../_php/RegistrarUsuario.php", "nombre="+nombre.value+"&apellidos="+apellidos.value+
                                                "&identificador="+identificador.value+"&email="+email.value
                                                +"&contrasenna="+contrasenna.value,
        function(texto) {
            var registrado = JSON.parse(texto);

            if(!registrado){
                alert("El usuario ya existe, introduce uno diferente")
            }else{
               alert("Usuario creado correctamente");
               iniciarSesion(identificador, contrasenna, false);
            }

        }, function (texto){
            notificarUsuario("Error Ajax al registrar usuario: " + texto);
        }
    );
}

// ---------- DOM GENERAL ----------

 function domCrearFormulario(action){

    formulario.innerHTML = "";

    var divRow = document.createElement("div");
    divRow.setAttribute("class", "row");

    var divCol12 = document.createElement("div");
    divCol12.setAttribute("class", "col-lg-12");

    var divForm1 = document.createElement("div");
    divForm1.setAttribute("class", "form-group");

    var identificador = document.createElement("input");
    identificador.setAttribute("type", "text");
    identificador.setAttribute("name", "identificador");
    identificador.setAttribute("id", "identificador");
    identificador.setAttribute("placeholder", "Usuario");
    identificador.setAttribute("required", true);
    identificador.setAttribute("class", "form-control");

    var divForm2 = document.createElement("div");
    divForm2.setAttribute("class", "form-group");

    var contrasenna = document.createElement("input");
    contrasenna.setAttribute("type", "password");
    contrasenna.setAttribute("name", "contrasenna");
    contrasenna.setAttribute("id", "contrasenna");
    contrasenna.setAttribute("placeholder", "Contraseña");
    contrasenna.setAttribute("required", true);
    contrasenna.setAttribute("class", "form-control");

    var divFormCenter = document.createElement("div");
    divFormCenter.setAttribute("class", "form-group text-center")

    var recuerdame = document.createElement("input");
    recuerdame.setAttribute("type", "checkbox");
    recuerdame.setAttribute("name", "recuerdame");
    recuerdame.setAttribute("id", "recuerdame");
    recuerdame.setAttribute("class", "form-check-input");

    var labelRecuerdame = document.createElement("label"); 
    labelRecuerdame.setAttribute("for", "recuerdame");
    labelRecuerdame.setAttribute("class", "form-check-label");
    labelRecuerdame.innerHTML = "Recuérdame ";  
    labelRecuerdame.style.marginRight = "10px";

    var divForm3 = document.createElement("div");
    divForm3.setAttribute("class", "form-group");

    var divRow2 = document.createElement("div");
    divRow2.setAttribute("class", "row");

    var divButton = document.createElement("div");
    divButton.setAttribute("clas", "col-sm-6 col-sm-offset-3");

    var divForm4 = document.createElement("div");
    divForm4.setAttribute("class", "form-group");

    var email = document.createElement("input");
    email.setAttribute("name", "email");
    email.setAttribute("type", "email");
    email.setAttribute("id", "email");
    email.setAttribute("placeholder", "Email");
    email.setAttribute("required", true);
    email.setAttribute("class", "form-control");

    var divForm5 = document.createElement("div");
    divForm5.setAttribute("class", "form-group");

    var contrasenna2 = document.createElement("input");
    contrasenna2.setAttribute("type", "password");
    contrasenna2.setAttribute("name", "contrasenna2");
    contrasenna2.setAttribute("id", "contrasenna2");
    contrasenna2.setAttribute("placeholder", "Confirmar contraseña");
    contrasenna2.setAttribute("required", true);
    contrasenna2.setAttribute("class", "form-control");

    var divForm6 = document.createElement("div");
    divForm6.setAttribute("class", "form-group");

    var nombre = document.createElement("input");
    nombre.setAttribute("type", "text");
    nombre.setAttribute("name", "nombre");
    nombre.setAttribute("id", "nombre");
    nombre.setAttribute("placeholder", "Nombre");
    nombre.setAttribute("required", true);
    nombre.setAttribute("class", "form-control");

    var divForm7 = document.createElement("div");
    divForm7.setAttribute("class", "form-group");

    var apellidos = document.createElement("input");
    apellidos.setAttribute("type", "text");
    apellidos.setAttribute("name", "apellidos");
    apellidos.setAttribute("id", "apellidos");
    apellidos.setAttribute("placeholder", "Apellidos");
    apellidos.setAttribute("required", true);
    apellidos.setAttribute("class", "form-control");

    if (action == "login") {
        var btnLogin = document.createElement("button");
        btnLogin.addEventListener("click", function(){
            iniciarSesion(identificador, contrasenna, recuerdame);
        })
        btnLogin.setAttribute("class", "form-control btn btn-login");
        btnLogin.innerHTML ="Iniciar sesión";

        divButton.appendChild(btnLogin);
        divRow2.appendChild(divButton);
        divForm3.appendChild(divRow2);

        divFormCenter.appendChild(labelRecuerdame);
        divFormCenter.appendChild(recuerdame);

        divForm2.appendChild(contrasenna);

        divForm1.appendChild(identificador);

        divCol12.appendChild(divForm1);
        divCol12.appendChild(divForm2);
        divCol12.appendChild(divFormCenter);
        divCol12.appendChild(divForm3);
       
        divRow.appendChild(divCol12);

        formulario.appendChild(divRow);
    }
    
    if (action == "register") {
        var btnRegister = document.createElement("button");
        btnRegister.addEventListener("click", function(){
            var correcto = comprobarContrasenna(contrasenna.value, contrasenna2.value);
            if(correcto){
            registrarUsuario(nombre, apellidos, identificador, email, contrasenna, contrasenna2);
            }
        })  
        btnRegister.setAttribute("class", "form-control btn btn-register");      
        btnRegister.innerHTML ="Registrarme";

        divButton.appendChild(btnRegister);
        divRow2.appendChild(divButton);
        divForm7.appendChild(divRow2);

        divForm6.appendChild(contrasenna2);

        divForm5.appendChild(contrasenna);

        divForm4.appendChild(identificador);

        divForm3.appendChild(email);

        divForm2.appendChild(apellidos);

        divForm1.appendChild(nombre);
        
        divCol12.appendChild(divForm1);
        divCol12.appendChild(divForm2);
        divCol12.appendChild(divForm3);
        divCol12.appendChild(divForm4);
        divCol12.appendChild(divForm5);
        divCol12.appendChild(divForm6);
        divCol12.appendChild(divForm7);

        divRow.appendChild(divCol12);

        formulario.appendChild(divRow);
    }

// ---------------- FUNCIONES UTILIDADES ----------------------

    function comprobarContrasenna(contrasenna, contrasenna2) {
        if(contrasenna != contrasenna2){
            alert("Error: Las contraseñas no coinciden");
            return false;
        } else{
            return true;
        }
        
    }
}