<?php

require_once "../_com/_DAO.php";

$juegoId = $_REQUEST["juegoId"];

$carrito = DAO::pedidoCrear($_SESSION["id"]);

foreach ($carrito as $linea) {
    $juego = DAO::juegoObtenerPorId($linea->getJuegoId()); 
    DAO::carritoEliminar($linea->getPedidoId(),$juegoId);
}
echo json_encode($juego);
?>