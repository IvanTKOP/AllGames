<?php

require_once "../_com/_DAO.php";

$juegoId = $_REQUEST["juegoId"];

$generos = DAO::generoObtenerPorJuegoId($juegoId);

echo json_encode($generos);
 
?>