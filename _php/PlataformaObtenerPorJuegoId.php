<?php

require_once "../_com/_DAO.php";

$juegoId = $_REQUEST["juegoId"];

$plataformas = DAO::plataformaObtenerPorJuegoId($juegoId);

echo json_encode($plataformas);
 
?>