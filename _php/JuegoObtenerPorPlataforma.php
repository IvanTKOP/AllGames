<?php 
require_once "../_com/_DAO.php";

$resultado = DAO::juegoObtenerPorPlataforma($_REQUEST["plataforma"]);

echo json_encode($resultado);

?>