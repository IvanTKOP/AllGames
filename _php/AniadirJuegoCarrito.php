<?php

require_once "../_com/_DAO.php";

$juegoId = $_REQUEST["juegoId"];

$encontrado = false;

$carrito = DAO::pedidoCrear($_SESSION["id"]);

foreach ($carrito as $fila) { // buscamos si esta el juego 
    if($fila->getJuegoId() == $juegoId) {
        $encontrado = true;
    }
}

if ($encontrado == false) { // El juego es nuevo y hay que meterlo al carrito
    $pedido = DAO::pedidoCarritoObtenerPorUsuarioId($_SESSION["id"]);
    DAO::carritoAgregarJuego($pedido->getPedidoId(), $juegoId); 
    $juego = DAO::juegoObtenerPorId($juegoId);
    echo json_encode($juego);
}



?>