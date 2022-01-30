// ----------------------------------- INICIO SESIÓN ------------------------------------------

window.onpaint =  comprobarSesionIniciada(); // inicia antes que window.onload 
window.onload = inicializar;




// ---------- VARIABLES GLOBALES ----------

var email;
var usuario;
var contrasenna1;
var contrasenna2;
var pedidos;
var nTotal;
var pTotal;
var nTotalCart;
var lastItem;


// ---------- MANEJADORES DE EVENTOS / COMUNICACIÓN CON PHP ----------

function inicializar() {
    contenido = document.getElementById("contenido");

    document.getElementById("perfil").addEventListener("click", function(){
        obtenerUsuario(false);
    });
    document.getElementById("btnPedidos").addEventListener("click", obtenerPedidosUsuario);
    document.getElementById("btnCerrarSesion").addEventListener("click", function(){
        window.location.href = "../_php/CerrarSesion.php";
    });

    email = document.getElementById("email");
    usuario = document.getElementById("usuario");
    contrasenna1 = document.getElementById("contrasenna1");
    contrasenna2 = document.getElementById("contrasenna2");
   

    obtenerUsuario(false);

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

function obtenerPedidosUsuario(){
    
    llamadaAjax("../_php/PedidoObtenerTodos.php", "",
        function(texto) {
             
            var pedidos = JSON.parse(texto);

            if (pedidos.length != 0){
                domCrearPedidoCabecera();
                for(var i=0; i<pedidos.length; i++) {
                    domCrearPedido(pedidos[i]);
                }
            }else {
                notificarUsuario("Todavía no ha realizado ningún pedido");
            }
        }, function (texto){
            notificarUsuario("Error Ajax al cargar carrito: " + texto);
        }
    );
}

function obtenerCarritoTicket(pedidoId) {

    var lastItem = false;

    llamadaAjax("../_php/CarritoObtenerPorPedidoId.php", "pedidoId="+parseInt(pedidoId),
        function(texto) {
            
            var carrito = JSON.parse(texto);
            
                pTotal = 0; // lo vamos a volver a calcular
               
                for (var i=0; i<carrito.length; i++) {
                    nTotal = 0; //lo vamos a rellenar con el length
                    nTotalCart = 0; // ""
                    addTotalCart(carrito.length);

                    if(carrito.length == (i+1)){ // Si es el ultimo
                        lastItem = true;
                    }

                    domCrearTicketItem(carrito[i], lastItem);
                    obtenerPedido(pedidoId);
                 }

        }, function (texto){
            notificarUsuario("Error Ajax al cargar carrito: " + texto);
        }
    );
}

function obtenerPedido(pedidoId){
    llamadaAjax("../_php/PedidoObtenerPorId.php","pedidoId="+parseInt(pedidoId),
    function(texto) {
            var pedido = JSON.parse(texto);
            rellenarTicketPedido(pedido);
            obtenerUsuario(true);
    }, function (texto){
        notificarUsuario("Error Ajax al obtener pedido: " + texto);
    }
);
}

function obtenerUsuario(loadTicket){
    llamadaAjax("../_php/UsuarioObtener.php","",
    function(texto) {
        
        var usuario = JSON.parse(texto);
        if(!loadTicket){
            domCrearPerfil(usuario);
        } else {
            rellenarTicketUsuario(usuario);
        }
    }, function (texto){
        notificarUsuario("Error Ajax al obtener usuario: " + texto);
    }
);
}

function actualizarUsuario(identificador, email, contrasenna){
    if(identificador.value == "" || email.value == "" || contrasenna.value == ""){
        alert("No puedes dejar campos vacíos, inténtalo de nuevo")
    } else {
        llamadaAjax("../_php/ActualizarUsuario.php", "identificador="+identificador.value+"&email="+email.value
                                                    +"&contrasenna="+contrasenna.value,
            function(texto) {
                var registrado = JSON.parse(texto);

                if(!registrado){
                    alert("El usuario ya existe, introduce uno diferente")
                }else{
                alert("Usuario actualizado correctamente");
                obtenerUsuario(false);
                }

            }, function (texto){
                notificarUsuario("Error Ajax al actualizar usuario: " + texto);
            }
        );
    }
}

function eliminarUsuario(){
    llamadaAjax("../_php/UsuarioEliminar.php","",
    function(texto) {

        notificarUsuario("Usuario eliminado correctamente.");
        window.location.href = "../_html/sesion-inicio-formulario.html";

    }, function (texto){
        notificarUsuario("Error Ajax al obtener usuario: " + texto);
    }
);
}

// ---------- DOM GENERAL ----------

function domCrearPerfil(usuario){
    contenido.innerHTML = "";

    var section = document.createElement("section");

    var divRow = document.createElement("div");
    divRow.setAttribute("class", "row");

    var divCol12 = document.createElement("div");
    divCol12.setAttribute("class", "col-lg-12");

    var divForm1 = document.createElement("div");
    divForm1.setAttribute("class", "form-group");

    var spanUsuario = document.createElement("span");
    spanUsuario.setAttribute("class", "spanPerfil");
    spanUsuario.innerHTML = "Usuario";

    var identificador = document.createElement("input");
    identificador.setAttribute("type", "text");
    identificador.setAttribute("name", "identificador");
    identificador.setAttribute("id", "identificador");
    identificador.setAttribute("value", usuario.identificador);
    identificador.setAttribute("required", true);
    identificador.setAttribute("class", "form-control");

    var divForm2 = document.createElement("div");
    divForm2.setAttribute("class", "form-group");

    var spanContrasenna = document.createElement("span");
    spanContrasenna.setAttribute("class", "spanPerfil");
    spanContrasenna.innerHTML = "Nueva Contraseña";

    var contrasenna = document.createElement("input");
    contrasenna.setAttribute("type", "password");
    contrasenna.setAttribute("name", "contrasenna");
    contrasenna.setAttribute("id", "contrasenna");
    contrasenna.setAttribute("placeholder", "Nueva Contraseña");
    contrasenna.setAttribute("required", true);
    contrasenna.setAttribute("class", "form-control");

    var divForm3 = document.createElement("div");
    divForm3.setAttribute("class", "form-group");
    
    var spanContrasenna2 = document.createElement("span");
    spanContrasenna2.setAttribute("class", "spanPerfil");
    spanContrasenna2.innerHTML = "Confirmar Nueva Contraseña";

    var divRow2 = document.createElement("div");
    divRow2.setAttribute("class", "row");

    var divButton = document.createElement("div");
    divButton.setAttribute("class", "col-sm-6 col-sm-offset-3");

    var divForm4 = document.createElement("div");
    divForm4.setAttribute("class", "form-group");

    var spanEmail = document.createElement("span");
    spanEmail.setAttribute("class", "spanPerfil");
    spanEmail.innerHTML = "Email";

    var email = document.createElement("input");
    email.setAttribute("name", "email");
    email.setAttribute("type", "email");
    email.setAttribute("id", "email");
    email.setAttribute("value", usuario.email);
    email.setAttribute("required", true);
    email.setAttribute("class", "form-control");

    var divForm5 = document.createElement("div");
    divForm5.setAttribute("class", "form-group");

    var contrasenna2 = document.createElement("input");
    contrasenna2.setAttribute("type", "password");
    contrasenna2.setAttribute("name", "contrasenna2");
    contrasenna2.setAttribute("id", "contrasenna2");
    contrasenna2.setAttribute("placeholder", "Confirmar Nueva Contraseña");
    contrasenna2.setAttribute("required", true);
    contrasenna2.setAttribute("class", "form-control");

    var btnGuardar = document.createElement("button");
    btnGuardar.addEventListener("click", function(){
        var correcto = comprobarContrasenna(contrasenna.value, contrasenna2.value);
        if(correcto){
        actualizarUsuario(identificador, email, contrasenna);
        }
    })  
    btnGuardar.setAttribute("class", "form-control btn btn-register");      
    btnGuardar.innerHTML ="Guardar Cambios";

    var btnBorrar = document.createElement("button");
    btnBorrar.addEventListener("click", function(){
        eliminarUsuario();
    });  
    btnBorrar.setAttribute("class", "form-control btn btn-danger");      
    btnBorrar.innerHTML ='<i class="fas fa-trash"></i>Eliminar Usuario';

    divButton.appendChild(btnGuardar);
    divRow2.appendChild(divButton);
    divForm5.appendChild(divRow2);

    divForm4.appendChild(spanContrasenna2);
    divForm4.appendChild(contrasenna2);

    divForm3.appendChild(spanContrasenna);
    divForm3.appendChild(contrasenna);

    divForm2.appendChild(spanEmail);
    divForm2.appendChild(email);

    divForm1.appendChild(spanUsuario);
    divForm1.appendChild(identificador);
    
    divCol12.appendChild(divForm1);
    divCol12.appendChild(divForm2);
    divCol12.appendChild(divForm3);
    divCol12.appendChild(divForm4);
    divCol12.appendChild(divForm5);
    divCol12.appendChild(btnBorrar);

    divRow.appendChild(divCol12);

    section.appendChild(divRow);

    contenido.appendChild(section);
}

function domCrearPedidoCabecera(){

    contenido.innerHTML = "";

    var table = document.createElement("table");
    table.setAttribute("id", "table");

    var h3 = document.createElement("h3");
    h3.setAttribute("class", "text-center");
    h3.innerHTML = "Mis Pedidos";

    var thead = document.createElement("thead");

    var tr1 = document.createElement("tr");

    var th1 = document.createElement("th");
    th1.innerHTML = "Número de referencia";

    var th2 = document.createElement("th");
    th2.innerHTML = "Fecha";

    var th3 = document.createElement("th");
    th3.innerHTML = "Factura";

    tr1.appendChild(th1);
    tr1.appendChild(th2);
    tr1.appendChild(th3);

    thead.appendChild(tr1);

    table.appendChild(thead);

    contenido.appendChild(h3);
    contenido.appendChild(table);

}
    

function domCrearPedido(pedido){
    
    var tBody = document.createElement("tbody");

    var tr2 = document.createElement("tr");
    
    var td1 = document.createElement("td");
    td1.innerHTML = "AGON-"+pedido.id;

    var td2 = document.createElement("td");
    td2.innerHTML = pedido.fechaPedido;

    var td3 = document.createElement("td");
    
    var btnTicket = document.createElement("button");
    btnTicket.setAttribute("class", "btn btn-primary");
    btnTicket.addEventListener("click", function(){
        modal(pedido.id);
    });
    btnTicket.innerHTML = "Ver Ticket";

    td3.appendChild(btnTicket);

    tr2.appendChild(td1);
    tr2.appendChild(td2);
    tr2.appendChild(td3);

    tBody.appendChild(tr2);

    document.getElementById("table").appendChild(tBody);

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

function addTotalCart(cantidad){

if (cantidad == 0) { // lo vaciamos
    nTotalCart = 0;    
}else {
    nTotalCart += cantidad;
}

}

function modal(pedidoId){ 
        $("#showModal").modal("show"); // abrimos modal

        $("#showModal").click(function() { // controlamos que al clickar fuera del content reset carrito
        //obtenerCarrito();
        });

        $("#modalContent").click(function (e) { // frenamos la propagación del evento
            e.stopPropagation();
        });

        // reiniciamos 
        ticketCartList.innerHTML = ""; 
        ticketTitle.innerHTML = "Número de referencia: AGON-";
        ticketGamekey.innerHTML = 'Gamekey: ';

        obtenerCarritoTicket(pedidoId);

        closeModal();
    }

function closeModal()  {
    $("#close").click(function() {
        $("#showModal").modal("hide");  // al clickar X cierra y reset carrito
    })

    ticketTitle.innerHTML = "Número de referencia: AGON-";
    ticketGamekey.innerHTML = 'Gamekey: ';
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
