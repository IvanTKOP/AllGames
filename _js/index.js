// ----------------------------------- ALLGAMES ------------------------------------------

window.onpaint =  comprobarSesionIniciada(); // inicia antes que window.onload 
window.onload = inicializar;




// ---------- VARIABLES GLOBALES ----------

var catalogo;
var cartItems;
var numTotal;
var precioTotal;
var pTotal = 0;
var nTotal = 0;
var nTotalCart = 0;
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

// ---------- MANEJADORES DE EVENTOS / COMUNICACIÓN CON PHP ----------

function inicializar() {
    cart();
    obtenerCarrito();
    modal();

    document.getElementById("btnBuscar").addEventListener("click", buscar);
    document.getElementById("btnTodos").addEventListener("click", obtenerJuegos);
    document.getElementById("btnPlaystation").addEventListener("click", function () {
        obtenerJuegosPorPlataforma("playstation");
    });
    document.getElementById("btnXbox").addEventListener("click", function () {
        obtenerJuegosPorPlataforma("xbox");
    });
    document.getElementById("btnSteam").addEventListener("click", function () {
        obtenerJuegosPorPlataforma("pc");
    });
    document.getElementById("cart").addEventListener("click", obtenerCarrito);

    obtenerJuegos();

    //comprobarAdmin();

    catalogo = document.getElementById("catalogo");
    cart = document.getElementsByClassName("cart");
    cartItems = document.getElementById("cartItems");
    numTotal = document.getElementById("numTotal");
    precioTotal = document.getElementById("precioTotal");
    modalBody = document.getElementById("modal-body");

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

function obtenerJuegos() {
    llamadaAjax("../_php/JuegoObtenerTodos.php", "",
        function(texto) {
            
            catalogo.innerHTML = "";

            var juegos = JSON.parse(texto);

            for (var i=0; i<juegos.length; i++) {
                domCrearJuego(juegos[i]);
            }
        
        }, function (texto){
            notificarUsuario("Error Ajax al cargar juegos: " + texto);
        }
    );
}

function obtenerJuegosPorPlataforma(plataforma) {
    catalogo.innerHTML = "";

    llamadaAjax("../_php/JuegoObtenerPorPlataforma.php", "plataforma=" +  plataforma,
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

function buscar() {

    catalogo.innerHTML = "";

    var buscar = document.getElementById("buscar");

 if (buscar.value != "" && buscar.value.length >= 3) {
        llamadaAjax("../_php/BuscarJuego.php", "buscar=" + buscar.value,
            function(texto) {
                if (texto != "" && texto != "null") { // cuando es null viene "null"
                    var juegos = JSON.parse(texto);

                    for(var i=0; i<juegos.length; i++) {
                        domCrearJuego(juegos[i]);
                    }
                } else {
                    alert("No se encontraron coincidencias");
                    obtenerJuegos();
                    buscar.value = "";
                }
            }, function(texto) {
                notificarUsuario("Error Ajax al filtrar juegos: " + texto);
            }
        );
    } else{
       alert("Error: Escriba mínimo 3 carácteres");
       obtenerJuegos();
    }
}

/*function comprobarAdmin() {
    llamadaAjax("../_php/ComprobarAdmin.php", "",
        function(texto) {
            var admin = JSON.parse(texto);
            if(admin){
                crearBtnInsertarPeliculaAdmin();
            }
        },
        function(texto) {
            notificarUsuario("Error Ajax al comprobar administrador: " + texto);
        }
    );
}*/

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

function obtenerCarrito() {

    llamadaAjax("../_php/CarritoObtener.php", "",
        function(texto) {
            cartItems.innerHTML = "";

            var carrito = JSON.parse(texto);
            
            if(carrito.length == 0) {
                cartItems.innerHTML = "Vacío"; // añadir algun mensaje y style

                //pintamos a 0 las variables totales
                precioTotal.innerHTML = 0 +'€';
                numTotal.innerHTML = 0;
                addTotalCart(0);
            } else {
                pTotal = 0; // lo vamos a volver a calcular
               
                for (var i=0; i<carrito.length; i++) {
                    nTotal = 0; //lo vamos a rellenar con el length
                    nTotalCart = 0; // ""
                    addTotalCart(carrito.length);
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
            addTotalCart(1); // sumamos 1 al total
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

        // Restamos 1 a variables totales
        pTotal -= parseFloat(juego.precio);
        nTotal--;
        nTotalCart--;

        // volvemos a pintar carrito
        obtenerCarrito();

    }, function (texto){
        notificarUsuario("Error Ajax al borrar juego carrito: " + texto);
    }
);
}

/* function obtenerUnidadesJuegoCarrito(juegoId) {
    llamadaAjax("../_php/ObtenerUnidadesJuegoCarrito.php", "juegoId="+parseInt(juegoId),
    function(texto) {   
        alert(JSON.parse(texto))
        return JSON.parse(texto);
    },
    function(texto) {
        notificarUsuario("Error Ajax al buscar unidades: " + texto);
    }
);
} */

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
    divDesplegable.setAttribute("id", "addtocart");
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

    catalogo.appendChild(divRow);
    

    }

    function domCrearJuegoCarrito(juegoCarrito, cantidad, precio) {

        var ul = document.createElement("ul");
        ul.setAttribute("class", "shopping-cart-items");
        ul.setAttribute("id", juegoCarrito.id);

        var li = document.createElement("li");
        li.setAttribute("class", "clearFix:after");

        var img = document.createElement("img");
        img.setAttribute("src", "../_img/"+juegoCarrito.portada + " ");
        img.setAttribute("width", "35px");
        img.setAttribute("height", "50px");

        var spanNombre = document.createElement("span");
        spanNombre.setAttribute("class", "item-name");
        spanNombre.innerHTML =  " " + juegoCarrito.nombre + " ";
        
        var spanPrecio = document.createElement("span");
        spanPrecio.setAttribute("class", "item-price");
        spanPrecio.innerHTML = juegoCarrito.precio  + "€ ";

/*         var inputCantidad = document.createElement("input");
        inputCantidad.setAttribute("class", "item-quantity");
        inputCantidad.setAttribute("type", "number");
        inputCantidad.setAttribute("min", "0");
        inputCantidad.setAttribute("max", "99");
        /* inputCantidad.setAttribute("value", ); 
        inputCantidad.setAttribute("style", "width:3em;");
 */
        var btnBorrar = document.createElement("button");
        btnBorrar.setAttribute("class", "btn btn-danger");
        btnBorrar.setAttribute("style", "width:1em; height:1.6em;");
        btnBorrar.setAttribute("id", "btnBorrar");
        btnBorrar.addEventListener("click", function(){
            borrarJuegoCarrito(juegoCarrito.id);
          });

        var i = document.createElement("i");
        i.setAttribute("class", "fas fa-trash");
        i.setAttribute("style", "display: flex; justify-content: center; margin-top: 0;");

        nTotal += cantidad;
        numTotal.innerHTML = nTotal;

        pTotal += precio;
        precioTotal.innerHTML = pTotal + "€";

        btnBorrar.appendChild(i);

        li.appendChild(img);
        li.appendChild(spanNombre);
        li.appendChild(spanPrecio);
       /*  li.appendChild(inputCantidad); */
        li.appendChild(btnBorrar);
        
        ul.appendChild(li);
        
        cartItems.appendChild(ul);


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

function addTotalCart(cantidad){
    var cart = $('#cart');
    nTotalCart += cantidad;
    cart.attr('data-totalitems', nTotalCart);
}

function modal(){ // https://getbootstrap.com/docs/4.0/components/modal/

    var modalConfirm = $('#modalConfirm');
    
    modalConfirm.on("click", function() {
        if (nTotalCart > 0){ 
            $("#showModal").modal("show");
        } else {
            alert("El carrito está vacío"); //mirar porque da mas de 1 alert
        }
    });

    var close = $('#close');

    close.on("click", function() {
        $("#showModal").modal("hide");
    });
    
}

function wishList(){
    var list = document.getElementById("toast");
    list.classList.add("show");
    list.innerHTML = '<i class="far fa-heart wish"></i> Product added to List';
    setTimeout(function(){
    list.classList.remove("show");
    },3000);
}
