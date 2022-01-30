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

    document.getElementById("modalConfirm").addEventListener("click", modal);
    document.getElementById("close").addEventListener("click", modal);
    

    obtenerJuegos();

    //comprobarAdmin();

    catalogo = document.getElementById("catalogo");
    cart = document.getElementsByClassName("cart");
    cartItems = document.getElementById("cartItems");
    numTotal = document.getElementById("numTotal");
    precioTotal = document.getElementById("precioTotal");
    modalBody = document.getElementById("modalBody");

    ticketCartList = document.getElementById("ticketCartList")
    ticketFecha = document.getElementById("ticketFecha");
    ticketUsuario = document.getElementById("ticketUsuario");
    ticketGamekey = document.getElementById("ticketGamekey");
    ticketText = document.getElementById("ticketText");
    ticketTitle = document.getElementById("ticketTitle");

    cartOpen = false;
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


function aniadirJuegoWishList(juegoId){
    llamadaAjax("../_php/AniadirJuegoWishList.php", "juegoId="+parseInt(juegoId),
        function(texto) {   
           toast('<i class="far fa-heart"></i>  Añadido a wishlist');
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
            
            if (carrito.length == 0) {
                cartItems.innerHTML = '<h6 class="text-Vacio">Tu carrito está vacío</h6>'; // añadir algun mensaje y style

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
            if(cartItems.innerHTML == '<h6 class="text-Vacio">Tu carrito está vacío</h6>') { // Si es la primera vez
                cartItems.innerHTML = "";
                pTotal = 0;
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

function obtenerCarritoTicket() {

    var lastItem = false;

    llamadaAjax("../_php/CarritoObtener.php", "",
        function(texto) {

            var carrito = JSON.parse(texto);
            
            if(carrito.length == 0) {
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

                    if(carrito.length == (i+1)){ // Si es el ultimo
                        lastItem = true;
                    }

                    domCrearTicketItem(carrito[i], lastItem);
                    obtenerPedido();
                 }
            }
        }, function (texto){
            notificarUsuario("Error Ajax al cargar carrito: " + texto);
        }
    );
}

function obtenerPedido(){
    llamadaAjax("../_php/PedidoObtener.php","",
    function(texto) {
            var pedido = JSON.parse(texto);
            rellenarTicketPedido(pedido);
            obtenerUsuario();
    }, function (texto){
        notificarUsuario("Error Ajax al obtener pedido: " + texto);
    }
);
}

function obtenerUsuario(){
    llamadaAjax("../_php/UsuarioObtener.php","",
    function(texto) {
            var usuario = JSON.parse(texto);
            rellenarTicketUsuario(usuario);
    }, function (texto){
        notificarUsuario("Error Ajax al obtener usuario: " + texto);
    }
);
}


// ---------- DOM GENERAL ----------

function domCrearJuego(juego) {
    
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "row");
    //divRow.setAttribute("id", 'card-'+juego.id);

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
    imgCard.addEventListener("click" , function(){
        window.location.href = "../_html/juego.html?juegoId="+juego.id;
    });


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
    h5Price.innerHTML= juego.precio+'€';

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
        img.setAttribute("style", "border-radius: 5px;")

        var spanNombre = document.createElement("span");
        spanNombre.setAttribute("class", "item-name");
        spanNombre.innerHTML =  " " + juegoCarrito.nombre + " ";
        
        var spanPrecio = document.createElement("span");
        spanPrecio.setAttribute("class", "item-price");
        spanPrecio.innerHTML = juegoCarrito.precio  + "€ ";

        var spanTiempoAlquiler = document.createElement("span");
        spanTiempoAlquiler.setAttribute("class", "spanAlquiler");
        spanTiempoAlquiler.innerHTML = "7 días de alquiler";

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
        precioTotal.innerHTML = pTotal.toFixed(2) + "€";

        btnBorrar.appendChild(i);

        li.appendChild(img);
        li.appendChild(spanNombre);
        li.appendChild(spanPrecio);
        li.appendChild(spanTiempoAlquiler);
        li.appendChild(btnBorrar);
        
        ul.appendChild(li);
        
        cartItems.appendChild(ul);

    }

    
    function domCrearTicketItem(juegoCarrito, lastItem) {
    
        var liItem = document.createElement("li");
        liItem.setAttribute("class", "ticket-CartItem");

        var imgPortada = document.createElement("img");
        imgPortada.setAttribute("src", "../_img/"+juegoCarrito.portada + " ");
        imgPortada.setAttribute("width", "40px");
        imgPortada.setAttribute("height", "55px");
        imgPortada.setAttribute("style", "margin-right: 10px;border-radius: 5px;")
        

        
        var spanNombre = document.createElement("span");
        spanNombre.setAttribute("class", "ticket-Nombre");
        spanNombre.innerHTML = juegoCarrito.nombre + ' ';

        var spanPrecio = document.createElement("span");
        spanPrecio.setAttribute("class", "ticket-Precio");
        spanPrecio.innerHTML = juegoCarrito.precio+"€";

        pTotal += parseFloat(juegoCarrito.precio);

        liItem.appendChild(imgPortada);
        liItem.appendChild(spanPrecio);
        liItem.appendChild(spanNombre);
        
        ticketCartList.appendChild(liItem);

        if(lastItem) { // si es el último pintamos el total
            domCrearTicketTotal(pTotal);
        }
    }

    function domCrearTicketTotal(pTotal) {

        var liItem = document.createElement("li");
        liItem.setAttribute("class", "ticket-CartItem");

        var spanTotal = document.createElement("span");
        spanTotal.setAttribute("class", "ticket-PrecioTotal");
        spanTotal.innerHTML= "TOTAL";

        var spanNTotal = document.createElement("span");
        spanNTotal.setAttribute("class", "ticket-Precio");
        spanNTotal.innerHTML = pTotal.toFixed(2)+"€";

        liItem.appendChild(spanTotal);
        liItem.appendChild(spanNTotal);

       
        ticketCartList.appendChild(liItem);
        
    }

    function rellenarTicketUsuario(usuario) {

        ticketUsuario.innerHTML = usuario.nombre + ' ' + usuario.apellidos;
        ticketText.innerHTML = 'Se enviará al correo: ' + usuario.email;
    }

    function rellenarTicketPedido(pedido) {

        ticketFecha.innerHTML = pedido.fechaPedido;
        ticketTitle.innerHTML = "Número de referencia: AGON-"+pedido.id;
        ticketGamekey.innerHTML = 'Gamekey: ' + pedido.gameKey;

        document.getElementById("verPedido").addEventListener("click", function() {
            window.location.href = "javascript:window.print()";
        })
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
    
    if (cantidad == 0) { // lo vaciamos
        nTotalCart = 0;    
    }else {
        nTotalCart += cantidad;
    }

    cart.attr('data-totalitems', nTotalCart);
}

function modal(){ 
    if(this.id == "modalConfirm"){
        if (nTotalCart > 0){ 
            $("#showModal").modal("show"); // abrimos modal

            $("#showModal").click(function() { // controlamos que al clickar fuera del content reset carrito
            obtenerCarrito();
            });

            $("#modalContent").click(function (e) { // frenamos la propagación del evento
                e.stopPropagation();
            });

            // reiniciamos 
            ticketCartList.innerHTML = ""; 
            ticketTitle.innerHTML = "Número de referencia: AGON-";
            ticketGamekey.innerHTML = 'Gamekey: ';

            obtenerCarritoTicket();
        } else {
            alert("El carrito está vacío"); 
        }
    } else if(this.id == "close"){  
        $("#showModal").modal("hide");  // al clickar X cierra y reset carrito
        
        obtenerCarrito();

        ticketTitle.innerHTML = "Número de referencia: AGON-";
        ticketGamekey.innerHTML = 'Gamekey: ';
    }
}


