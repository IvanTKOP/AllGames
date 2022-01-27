<?php 
require_once "../_com/_DAO.php";

$resultado = DAO::juegoObtenerTodos();

echo json_encode($resultado);

?>