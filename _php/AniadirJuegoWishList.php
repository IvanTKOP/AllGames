<?php

require_once "../_com/_DAO.php";

$juegoId = $_REQUEST["juegoId"];

$resultado = DAO::aniadirJuegoWishList($juegoId, $_SESSION["id"]);


echo json_encode($resultado);

?>