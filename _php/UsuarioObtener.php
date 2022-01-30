<?php

require_once "../_com/_DAO.php";

$resultado = DAO::usuarioObtenerPorId($_SESSION["id"]);

echo json_encode($resultado);