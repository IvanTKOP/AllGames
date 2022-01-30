<?php

require_once "../_com/_DAO.php";

$pedidoId = $_REQUEST["pedidoId"];

$resultado = DAO::pedidoObtenerPorId($pedidoId);

echo json_encode($resultado);

?>
