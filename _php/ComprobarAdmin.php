<?php

require_once "../_com/_DAO.php";

$resultado = DAO::usuarioComprobarAdministrador($_SESSION["id"]);

echo json_encode($resultado);

?>