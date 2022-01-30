<?php

require_once "../_com/_DAO.php";

$reseniaId = $_REQUEST["reseniaId"];

$resenia = DAO::reseniaObtenerPorId($reseniaId);

$usuario = DAO::usuarioObtenerPorId($resenia->getUsuarioId());

echo json_encode($usuario);