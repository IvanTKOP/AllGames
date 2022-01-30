<?php

require_once "../_com/_DAO.php";

$usuario = DAO::usuarioObtenerPorId($_SESSION["id"]);

echo json_encode($usuario);

