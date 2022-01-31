// ----------------------------------- Wishlist ------------------------------------------

window.onpaint =  comprobarSesionIniciada(); // inicia antes que window.onload */
window.onload = inicializar;




// ---------- VARIABLES GLOBALES ----------

var catalogo;


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
    obtenerWishlist();
    catalogo = document.getElementById("catalogo");

    //REDIRECCIONES
    document.getElementById("cart").addEventListener("click", function(){
        window.location.href = "../_html/index.html";
    })
    document.getElementById("btnBuscar").addEventListener("click", function(){
        window.location.href = "../_html/index.html";
    })
    document.getElementById("inputBuscar").addEventListener("click", function(){
        window.location.href = "../_html/index.html";
    })
}

function obtenerWishlist() {
    llamadaAjax("../_php/WishlistObtener.php", "",
        function(texto) {
            catalogo.innerHTML = "";

            var juegos = JSON.parse(texto);

            if (juegos != null) {
                for (var i=0; i<juegos.length; i++) {
                    domCrearJuego(juegos[i]);
                }
            } else{
                notificarUsuario("Tu wishlist está vacía");
                window.location.href = "../_html/index.html";
            }

        }, function (texto){
            notificarUsuario("Error Ajax al cargar juegos: " + texto);
        }
    );
}

function borrarJuegoWishList(juegoId){
    llamadaAjax("../_php/BorrarJuegoWishList.php", "juegoId="+parseInt(juegoId),
        function(texto) {   
          toast('<i class="far fa-heart-broken"></i> Eliminado de wishlist');
          obtenerWishlist();
        },
        function(texto) {
            notificarUsuario("Error Ajax al borrar juego de wishlist: " + texto);
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
       borrarJuegoWishList(juego.id); 
    });

    var imgCard = document.createElement("img");
    imgCard.setAttribute("src","../_img/"+ juego.portada);
    imgCard.setAttribute("class", "first-image");
    imgCard.addEventListener("click" , function(){
        window.location.href = "../_html/juego.html?juegoId="+juego.id;
    });

    var divBody = document.createElement("div");
    divBody.setAttribute("class", "card-body");

   /*  var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.addEventListener("click", function(){
        aniadirJuegoCarrito(juego.id);
        if(cartOpen == false) {
            document.getElementById("shopping-cart").style.display = "block";
        }
    })  */
    
    var divPrice = document.createElement("div");
    divPrice.setAttribute("class", "saleCallout");

    var h5Price = document.createElement("h5");
    h5Price.setAttribute("class", "h5Price")
    h5Price.innerHTML= juego.precio+'€';

    /* var hr = document.createElement("hr");

    var divDesplegable = document.createElement("div");
    divDesplegable.setAttribute("class", "card-body-a");
    divDesplegable.setAttribute("id", "addtocart");
    divDesplegable.innerHTML = " Añadir al carrito <i class='fas fa-cart-plus'></i> | "+ juego.precio+ '€';
 */
    var divDesplegable2 = document.createElement("div");
    divDesplegable2.setAttribute("style", "text-align: center;");
    
    var aTitle = document.createElement("a");
    aTitle.setAttribute("href", "../_html/juego.html?juegoId="+juego.id);


    var h5 = document.createElement("h5");
    h5.setAttribute("class", "card-title");
    h5.innerHTML = juego.nombre;
      
    aTitle.appendChild(h5);

    divDesplegable2.appendChild(aTitle);
    
    /* a.appendChild(divDesplegable); */

    divPrice.appendChild(h5Price);

    /* divBody.appendChild(a); */
   /*  divBody.appendChild(hr); */
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
// ---------- JQQUERY ----------

    function toast(texto){
        var list = document.getElementById("toast");
        list.classList.add("show");
        list.innerHTML = texto;
        setTimeout(function(){
        list.classList.remove("show");
        },3000);
    }
    