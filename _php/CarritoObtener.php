<?php

require_once "../_com/_DAO.php";

$resultado = [];

$carrito = DAO::pedidoCrear($_SESSION["id"]);

foreach($carrito as $juego){
    $juego = DAO::juegoObtenerPorId($juego->getJuegoId());
    array_push($resultado, $juego);
}
 

echo json_encode($resultado);
 
?>