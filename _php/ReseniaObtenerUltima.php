<?php

require_once "../_com/_DAO.php";

$resultado = DAO::reseniaObtenerUltimaInsertada();

echo json_encode($resultado);

?>