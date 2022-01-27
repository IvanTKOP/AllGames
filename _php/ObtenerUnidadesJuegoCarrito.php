<?php

require_once "../_com/_DAO.php";

$resultado = [];

$juegoId = $_REQUEST["juegoId"];


$carrito = DAO::carritoObtenerUsuarioId($_SESSION["id"]); // comprueba si tiene pedido cerrado

foreach ($carrito as $fila) { // buscamos si esta el juego 
    if($fila->getJuegoId() == $juegoId) {
        $resultado = $fila->getUnidades();
        echo json_encode($resultado);
    }
}