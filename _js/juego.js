// ----------------------------------- ALLGAMES ------------------------------------------

window.onpaint =  comprobarSesionIniciada(); // inicia antes que window.onload 
window.onload = inicializar;




// ---------- VARIABLES GLOBALES ----------

var juegoId;
var cartItems;
var numTotal;
var precioTotal;
var pTotal = 0;
var nTotal = 0;
var cartOpen = false;
var valoracion = 0;


// ---------- MANEJADORES DE EVENTOS / COMUNICACIÓN CON PHP ----------

function inicializar() {

    obtenerJuegoIdUrl(); // pillamos antes el juegoId de la url
    obtenerJuego(juegoId);
    obtenerGenero(juegoId);
    obtenerPlataforma(juegoId);
    obtenerResenias(juegoId);

    infoPelicula = document.getElementById("infoPelicula");

    cartOpen = false;

    document.getElementById("btnWishlist").addEventListener("click", function(){
        aniadirJuegoWishList(juegoId);
    });

    document.getElementById("insertar").addEventListener("click", insertarResenia);

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

    // VALORACION
    document.getElementById("star1").addEventListener("click", function() {
        document.getElementById("star1").className= "fas fa-star";
        document.getElementById("star2").className= "far fa-star";
        document.getElementById("star3").className= "far fa-star";
        document.getElementById("star4").className= "far fa-star";
        document.getElementById("star5").className= "far fa-star";
        valoracion = 1;
    })
    document.getElementById("star2").addEventListener("click", function() {
        document.getElementById("star1").className= "fas fa-star";
        document.getElementById("star2").className= "fas fa-star";
        document.getElementById("star3").className= "far fa-star";
        document.getElementById("star4").className= "far fa-star";
        document.getElementById("star5").className= "far fa-star";
        valoracion = 2;
    })
    document.getElementById("star3").addEventListener("click", function() {
        document.getElementById("star1").className= "fas fa-star";
        document.getElementById("star2").className= "fas fa-star";
        document.getElementById("star3").className= "fas fa-star";
        document.getElementById("star4").className= "far fa-star";
        document.getElementById("star5").className= "far fa-star";
        valoracion = 3;
    })
    document.getElementById("star4").addEventListener("click", function() {
        document.getElementById("star1").className= "fas fa-star";
        document.getElementById("star2").className= "fas fa-star";
        document.getElementById("star3").className= "fas fa-star";
        document.getElementById("star4").className= "fas fa-star";
        document.getElementById("star5").className= "far fa-star";
        valoracion = 4;
    })
    document.getElementById("star5").addEventListener("click", function() {
        document.getElementById("star1").className= "fas fa-star";
        document.getElementById("star2").className= "fas fa-star";
        document.getElementById("star3").className= "fas fa-star";
        document.getElementById("star4").className= "fas fa-star";
        document.getElementById("star5").className= "fas fa-star";
        valoracion = 5;
    })
}

function obtenerJuego(juegoId) {
    llamadaAjax("../_php/JuegoObtenerPorId.php", "juegoId="+ parseInt(juegoId),
        function(texto) {
            var juego = JSON.parse(texto);
            
            domCrearJuego(juego);
            
        }, function (texto){
            notificarUsuario("Error Ajax al cargar juego: " + texto);
        }
    );
}

function obtenerGenero(juegoId) {
    llamadaAjax("../_php/GeneroObtenerPorJuegoId.php", "juegoId="+parseInt(juegoId),
    function(texto) {

        var genero = JSON.parse(texto);

        for (var i=0; i<genero.length; i++) {
            obtenerNombreGenero(genero[i].generoId);
        }
        
    }, function (texto){
        notificarUsuario("Error Ajax al cargar Genero: " + texto);
    }
);
}

function obtenerNombreGenero(generoId) {
    
    llamadaAjax("../_php/GeneroObtenerPorId.php", "generoId="+parseInt(generoId),
    function(texto) {
        var genero = JSON.parse(texto);
        
        rellenarGenero(genero.nombre);
        
    }, function (texto){
        notificarUsuario("Error Ajax al cargar Genero: " + texto);
    }
);
}

function obtenerPlataforma(juegoId) {
    llamadaAjax("../_php/PlataformaObtenerPorJuegoId.php", "juegoId="+parseInt(juegoId),
    function(texto) {

        var plataforma = JSON.parse(texto);

        for (var i=0; i<plataforma.length; i++) {
            obtenerNombrePlataforma(plataforma[i].plataformaId, parseInt(juegoId));
        }
        
    }, function (texto){
        notificarUsuario("Error Ajax al cargar Plataforma: " + texto);
    }
);
}

function obtenerNombrePlataforma(plataformaId) {
    
    llamadaAjax("../_php/PlataformaObtenerPorId.php", "plataformaId="+parseInt(plataformaId),
    function(texto) {
        var plataforma = JSON.parse(texto);
        
        rellenarPlataforma(plataforma.id);
        
    }, function (texto){
        notificarUsuario("Error Ajax al cargar Plataforma: " + texto);
    }
);
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

function obtenerResenias(juegoId) {
    llamadaAjax("../_php/ReseniasObtener.php", "juegoId=" + parseInt(juegoId),
        function(texto) {  

            var resenias = JSON.parse(texto);
        

            if(resenias != null) {
                for (var i=0; i<resenias.length; i++) {
                   obtenerUsuarioResenia(resenias[i]);
                }
            }
        },
        function(texto) {
            notificarUsuario("Error Ajax al obtener resenias: " + texto);
        }
    );
}

function insertarResenia() {
    llamadaAjax("../_php/ReseniaInsertar.php", "mensaje=" + document.getElementById("insertarResenia").value+
                "&juegoId="+parseInt(juegoId)+"&valoracion="+valoracion,
        function(texto) {
            
            var resenia = JSON.parse(texto);
            
            document.getElementById("insertarResenia").value = ""; //vaciamos 
            valoracion = 0;

            obtenerUsuarioResenia(resenia);
            
        },
        function(texto) {
            notificarUsuario("Error Ajax al insertar resenia: " + texto);
        }
    );
}

function obtenerUsuarioResenia(resenia){
    llamadaAjax("../_php/ReseniaObtenerUsuario.php","reseniaId=" + parseInt(resenia.id),
    function(texto) {
        var usuario = JSON.parse(texto);
        
        domCrearResenia(resenia, usuario);

    }, function (texto){
        notificarUsuario("Error Ajax al obtener usuario: " + texto);
    }
);
}


// ---------- DOM GENERAL ----------

function domCrearJuego(juego) {

    document.getElementById("aPrecio").innerHTML = parseInt(juego.precio) * 2 + '€';

    document.getElementById("precio").innerHTML = juego.precio+ '€';

    document.getElementById("portada").setAttribute("src","../_img/"+ juego.portada);

    document.getElementById("nombre").innerHTML = juego.nombre;
   
    document.getElementById("pegi").setAttribute("src","../_img/"+ juego.pegi);

    document.getElementById("descripcion").innerHTML = juego.descripcion;

    var trailer = document.createElement("p");
    trailer.setAttribute("class", "ml-auto")
    trailer.setAttribute("id", "pTrailer");
    trailer.innerHTML = juego.trailer;

    document.getElementById("trailer").appendChild(trailer);
    

}

function rellenarGenero(nombre){

        var span = document.createElement("span");
        span.innerHTML = nombre+'  ';

        document.getElementById("genero").appendChild(span);

}

function rellenarPlataforma(id){

        var btnPlataforma = obtenerInfoPlataforma(id, "btn");
        var iPlataforma = obtenerInfoPlataforma(id, "i");

        var btn = document.createElement("btn");
        btn.setAttribute("class", btnPlataforma);
        btn.setAttribute("style", "margin-right: 1rem;")

        var i = document.createElement("i");
        i.setAttribute("class", iPlataforma);

        btn.appendChild(i);

        document.getElementById("plataforma").appendChild(btn);

}

    function domCrearResenia(resenia, usuario){

        var divMensaje = document.createElement("div");
        divMensaje.setAttribute("class", "divInsertarResenia");

        var divMensaje2 = document.createElement("div");
        divMensaje2.setAttribute("class", "divInsertarResenia2");

        var divValoracion = document.createElement("div");
        divValoracion.setAttribute("class", "divValoracion");
        divValoracion.setAttribute("id", "divValoracion"+resenia.id);

        var pMensaje = document.createElement("p");
        pMensaje.setAttribute("class", "pMensaje");
        pMensaje.innerHTML = resenia.mensaje;

        var divDatosTop = document.createElement("div");
        
        var divDatosBottom = document.createElement("div");
        
        var divDate = document.createElement("div");
        divDate.setAttribute("class", "fecha");

        var date = document.createElement("span");
        date.setAttribute("class", "datos");
        date.innerHTML = resenia.fecha;

        var divNombreEntero = document.createElement("div");
        divNombreEntero.setAttribute("class", "nombre");

        var nombre = document.createElement("span");
        nombre.setAttribute("class", "datos");
        nombre.innerHTML = usuario.nombre+" ";

        var apellidos = document.createElement("span");
        apellidos.setAttribute("class", "datos");
        apellidos.innerHTML = usuario.apellidos;

        var br1 = document.createElement("br");
        var br2 = document.createElement("br");

        divDate.appendChild(date);

        divNombreEntero.appendChild(nombre);
        divNombreEntero.appendChild(apellidos);

        divDatosTop.appendChild(divNombreEntero);
        divDatosTop.appendChild(divValoracion);

        divDatosBottom.appendChild(divDate);

        divMensaje2.appendChild(divDatosTop);
        divMensaje2.appendChild(br1);
        divMensaje2.appendChild(pMensaje);
        divMensaje2.appendChild(br2);
        divMensaje2.appendChild(divDatosBottom);

        divMensaje.appendChild(divMensaje2);

        document.getElementById("resenias").appendChild(divMensaje);

        domCrearValoracion(resenia.valoracion, resenia.id);

    }

    function domCrearValoracion(valoracion, idDivValoraciones){

        var star1 = document.createElement("i");
        var star2 = document.createElement("i");
        var star3 = document.createElement("i");
        var star4 = document.createElement("i");
        var star5 = document.createElement("i");
        
        if(valoracion == 5){
            star1.setAttribute("class", "fas fa-star");
            star2.setAttribute("class", "fas fa-star");
            star3.setAttribute("class", "fas fa-star");
            star4.setAttribute("class", "fas fa-star");
            star5.setAttribute("class", "fas fa-star");
        } else if(valoracion == 4){
            star1.setAttribute("class", "fas fa-star");
            star2.setAttribute("class", "fas fa-star");
            star3.setAttribute("class", "fas fa-star");
            star4.setAttribute("class", "fas fa-star");
            star5.setAttribute("class", "far fa-star");
        } else if(valoracion == 3){
            star1.setAttribute("class", "fas fa-star");
            star2.setAttribute("class", "fas fa-star");
            star3.setAttribute("class", "fas fa-star");
            star4.setAttribute("class", "far fa-star");
            star5.setAttribute("class", "far fa-star");
        } else if(valoracion == 2){
            star1.setAttribute("class", "fas fa-star");
            star2.setAttribute("class", "fas fa-star");
            star3.setAttribute("class", "far fa-star");
            star4.setAttribute("class", "far fa-star");
            star5.setAttribute("class", "far fa-star");
        } else if(valoracion == 1){
            star1.setAttribute("class", "fas fa-star");
            star2.setAttribute("class", "far fa-star");
            star3.setAttribute("class", "far fa-star");
            star4.setAttribute("class", "far fa-star");
            star5.setAttribute("class", "far fa-star");
        } else if(valoracion == 0){
            star1.setAttribute("class", "far fa-star");
            star2.setAttribute("class", "far fa-star");
            star3.setAttribute("class", "far fa-star");
            star4.setAttribute("class", "far fa-star");
            star5.setAttribute("class", "far fa-star");
        }

        document.getElementById("divValoracion"+idDivValoraciones).appendChild(star1);
        document.getElementById("divValoracion"+idDivValoraciones).appendChild(star2);
        document.getElementById("divValoracion"+idDivValoraciones).appendChild(star3);
        document.getElementById("divValoracion"+idDivValoraciones).appendChild(star4);
        document.getElementById("divValoracion"+idDivValoraciones).appendChild(star5);

    }
// ---------------- FUNCIONES UTILIDADES ----------------------

    function obtenerJuegoIdUrl(){
        var urlEntera = window.location.search;
        var urlParams = new URLSearchParams(urlEntera);
        juegoId = urlParams.get('juegoId');
    }

    function obtenerInfoPlataforma(id, dato){
        if(dato == "btn"){
            if(id==1){
                return "btn btn-primary";
            } else if(id==2){
                return "btn btn-dark";
            } else if(id==3){
                return "btn btn-success";
            }
        } else {
            if(id==1){
                return "fab fa-playstation";
            } else if(id==2){
                return "fab fa-steam";
            } else if(id==3){
                return "fab fa-xbox";
            }
        }
    }

