// ----------------------------------- ALLGAMES ------------------------------------------

window.onpaint =  comprobarSesionIniciada(); // inicia antes que window.onload 
window.onload = inicializar;




// ---------- VARIABLES GLOBALES ----------

var juego;
var juegoId;
var cartItems;
var numTotal;
var precioTotal;
var pTotal = 0;
var nTotal = 0;
var cartOpen = false;


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

function obtenerIdUrl(){
    var urlEntera = window.location.search;
    var urlParams = new URLSearchParams(urlEntera);
    juegoId = urlParams.get('juegoId');
    console.log(juegoId);
}

// ---------- MANEJADORES DE EVENTOS / COMUNICACIÓN CON PHP ----------

function inicializar() {
    cart();

    document.getElementById("cart").addEventListener("click", obtenerCarrito);

    obtenerIdUrl(); // pillamos antes el juegoId de la url
    obtenerJuego(juegoId);

    //comprobarAdmin();

    infoPelicula = document.getElementById("infoPelicula");
    cartItems = document.getElementById("cartItems");
    numTotal = document.getElementById("numTotal");
    precioTotal = document.getElementById("precioTotal");

    cartOpen = false;
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

function obtenerJuego(juegoId) {
    llamadaAjax("../_php/JuegoObtenerPorId.php", "juegoId="+ juegoId,
        function(texto) {
            var juego = JSON.parse(texto);
            
            domCrearJuego(juego);
            
        }, function (texto){
            notificarUsuario("Error Ajax al cargar juego: " + texto);
        }
    );
}

function obtenerCarrito() {

    llamadaAjax("../_php/CarritoObtener.php", "",
        function(texto) {
            cartItems.innerHTML = "";

            var carrito = JSON.parse(texto);
            
            if(carrito.length == 0) {
                cartItems.innerHTML = "Vacío";
                precioTotal.innerHTML = 0 +'€';
                numTotal.innerHTML = 0;
            } else {
                pTotal = 0;
               
                for (var i=0; i<carrito.length; i++) {
                    nTotal = 0;
                    domCrearJuegoCarrito(carrito[i], carrito.length, parseFloat(carrito[i].precio)); 
                 }
            }
        }, function (texto){
            notificarUsuario("Error Ajax al cargar carrito: " + texto);
        }
    );
}

function aniadirJuegoCarrito(juegoId){
    llamadaAjax("../_php/AniadirJuegoCarrito.php", "juegoId="+parseInt(juegoId),
    function(texto) {
        if(texto){
            if(cartItems.innerHTML == "Vacío") { // Si es la primera vez
                cartItems.innerHTML = "";
            }
            var juego = JSON.parse(texto);
            domCrearJuegoCarrito(juego, 1, parseFloat(juego.precio)); 
        }
    }, function (texto){
        notificarUsuario("Error Ajax al borrar juego carrito: " + texto);
    }
);
}

function borrarJuegoCarrito(juegoId){
    llamadaAjax("../_php/BorrarJuegoCarrito.php", "juegoId="+parseInt(juegoId),
    function(texto) {
        var juego = JSON.parse(texto);
        pTotal -= parseFloat(juego.precio);
        nTotal--;
        obtenerCarrito();
    }, function (texto){
        notificarUsuario("Error Ajax al borrar juego carrito: " + texto);
    }
);
}

function aniadirJuegoWishList(juegoId){
    wishList();
    llamadaAjax("../_php/AniadirJuegoWishList.php", "juegoId="+parseInt(juegoId),
        function(texto) {   
            alert("Añadido")
        },
        function(texto) {
            notificarUsuario("Error Ajax al añadir juego a wishlist: " + texto);
        }
    );
}

// ---------- DOM GENERAL ----------

function domCrearJuego(juego) {
    
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "row");

    var divCol = document.createElement("div");
    divCol.setAttribute("class", "col-lg-4");

    var divCard = document.createElement("div");
    divCard.setAttribute("class", "card");
    divCard.setAttribute("style", "width:18rem;");

    var spanHeart = document.createElement("span");
    spanHeart.setAttribute("class", "heart");

    var iHeart = document.createElement("i");
    iHeart.setAttribute("class", "fas fa-heart");
    iHeart.addEventListener("click",  function () {
       aniadirJuegoWishList(juego.id); 
    });

    var imgCard = document.createElement("img");
    imgCard.setAttribute("src","../_img/"+ juego.portada);
    imgCard.setAttribute("class", "first-image");

    var divBody = document.createElement("div");
    divBody.setAttribute("class", "card-body");

    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.addEventListener("click", function(){
        aniadirJuegoCarrito(juego.id);
        if(cartOpen == false) {
            document.getElementById("shopping-cart").style.display = "block";
        }
    })
    
    var divPrice = document.createElement("div");
    divPrice.setAttribute("class", "saleCallout");

    var h5Price = document.createElement("h5");
    h5Price.setAttribute("class", "h5Price")
    h5Price.innerHTML= juego.precio;

    var hr = document.createElement("hr");

    var divDesplegable = document.createElement("div");
    divDesplegable.setAttribute("class", "card-body-a");
    divDesplegable.innerHTML = " Añadir al carrito <i class='fas fa-cart-plus'></i> | "+ juego.precio+ '€';

    var divDesplegable2 = document.createElement("div");
    divDesplegable2.setAttribute("style", "text-align: center;");
    
    var aTitle = document.createElement("a");
    aTitle.setAttribute("href", "../_html/juego.html?juegoId="+juego.id);


    var h5 = document.createElement("h5");
    h5.setAttribute("class", "card-title");
    h5.innerHTML = juego.nombre;
      
    aTitle.appendChild(h5);

    divDesplegable2.appendChild(aTitle);
    
    a.appendChild(divDesplegable);

    divPrice.appendChild(h5Price);

    divBody.appendChild(a);
    divBody.appendChild(hr);
    divBody.appendChild(divDesplegable2);

    spanHeart.appendChild(iHeart);

    divCard.appendChild(divPrice);
    divCard.appendChild(spanHeart);
    divCard.appendChild(imgCard);
    divCard.appendChild(divBody);

    divCol.appendChild(divCard);

    divRow.appendChild(divCol);

    infoPelicula.appendChild(divRow);

    }

// ---------- JQQUERY ----------

function cart(){

    var cart = $('#cart');
    
    cart.on("click", function() {
        $(".shopping-cart").fadeToggle("fast");
    });
    
    if(cartOpen == false) {
        cartOpen = true;
    } else {
        cartOpen = false;
    }
}
