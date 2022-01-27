// ----------------------------------- Wishlist ------------------------------------------

window.onpaint =  comprobarSesionIniciada(); // inicia antes que window.onload */
window.onload = inicializar;




// ---------- VARIABLES GLOBALES ----------

var contenido;


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
    /*document.getElementById("btnBuscar").addEventListener("click", cargarBusqueda, false);*/
    obtenerJuegosWishlist();
    contenido = document.getElementById("contenido");
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
function obtenerJuegosWishlist() {
    llamadaAjax("../_php/JuegoObtenerWishlist.php", "",
        function(texto) {
            
            var juegos = JSON.parse(texto);

            for (var i=0; i<juegos.length; i++) {
                domCrearJuego(juegos[i]);
            }
        
        }, function (texto){
            notificarUsuario("Error Ajax al cargar juegos: " + texto);
        }
    );
}

// ---------- DOM GENERAL ----------

function domCrearJuego(juego) {
    
   /* var divCard = document.createElement("div");
    divCard.setAttribute("class", "example-2 card");
    divCard.setAttribute("id", juego.id);

    var divWrapper = document.createElement("div");
    divWrapper.setAttribute("class", "wrapper");

    var divHeader = document.createElement("div");
    divHeader.setAttribute("class", "header");

    var divDate = document.createElement("div");
    divDate.setAttribute("class", "date");

    var spanDate = document.createElement("span");
    spanDate.setAttribute("class", "year");
    spanDate.innerHTML = pelicula.anio;
    divDate.appendChild(spanDate);

    var ulIconos = document.createElement("ul");
      ulIconos.setAttribute("class", "menu-content");
      var liCorazon = document.createElement("li");
      var aCorazon = document.createElement("i");
      aCorazon.setAttribute("href", "#");
      aCorazon.setAttribute("class", "fas fa-heart");
      aCorazon.setAttribute("id", "corazon");
      aCorazon.setAttribute("title", "Añadir "+ juego.nombre + " a Favoritos");
      aCorazon.setAttribute("data-placement", "top");
      aCorazon.addEventListener("click", function(){
        aniadirJuegoWishList(juego.id);
      })
      
      liCorazon.appendChild(aCorazon);
      ulIconos.appendChild(liCorazon);
      divHeader.appendChild(divDate);
      divHeader.appendChild(ulIconos);
    */

      var div1 = document.createElement("div");
      div1.setAttribute("class", "card");

      var imgCaratula = document.createElement("img");
      imgCaratula.setAttribute("id", "imgNovedades");
      imgCaratula.setAttribute("class", "imgNovedades");
      imgCaratula.setAttribute("src", "../_img/"+juego.portada);    
      imgCaratula.setAttribute("width", "270px");
      imgCaratula.setAttribute("height", "400px");

      div1.appendChild(imgCaratula);
      contenido.appendChild(div1);
    }