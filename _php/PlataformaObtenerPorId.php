<?php

require_once "../_com/_DAO.php";

$plataformaId = $_REQUEST["plataformaId"];

$resultado = DAO::plataformaObtenerPorId($plataformaId);

echo json_encode($resultado);

?>
