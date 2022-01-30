<?php

require_once "../_com/_DAO.php";

$juegoId = $_REQUEST["juegoId"];

$resultado = DAO::reseniasObtenerPorJuegoId($juegoId);

echo json_encode($resultado);