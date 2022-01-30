<?php

require_once "../_com/_DAO.php";

$generoId = $_REQUEST["generoId"];

$resultado = DAO::generoObtenerPorId($generoId);

echo json_encode($resultado);

?>
