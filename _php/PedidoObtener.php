<?php

require_once "../_com/_DAO.php";

$pedido = DAO::pedidoCarritoObtenerPorUsuarioId($_SESSION["id"]);

DAO::pedidoConfirmar($pedido->getId());

$resultado = DAO::pedidoCarritoObtenerPorUsuarioId($_SESSION["id"]);


echo json_encode($resultado);

?>
