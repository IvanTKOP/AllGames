<?php

require_once "../_com/_DAO.php";

$resultado = [];
$pedidoId = $_REQUEST["pedidoId"];

$carrito = DAO::carritoObtenerPorPedidoId($pedidoId);

foreach($carrito as $juego){
    $juego = DAO::juegoObtenerPorId($juego->getJuegoId());
    array_push($resultado, $juego);
}
 

echo json_encode($resultado);
 
?>