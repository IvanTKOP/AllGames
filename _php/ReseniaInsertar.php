<?php

require_once "../_com/_DAO.php";

$mensaje = $_REQUEST["mensaje"];
$juegoId = $_REQUEST["juegoId"];
$valoracion = $_REQUEST["valoracion"];
$usuarioId = $_SESSION["id"];

DAO::insertarResenia($valoracion, $mensaje, $juegoId, $usuarioId);

$resultado = DAO::reseniaObtenerUltimaInsertada();

echo json_encode($resultado);

?>