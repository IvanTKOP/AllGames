<?php
require_once "../_com/_DAO.php";

$juegoId = $_REQUEST["juegoId"];

 DAO::borrarJuegoWishList($juegoId, $_SESSION["id"]);

?>

