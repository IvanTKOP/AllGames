<?php

require_once "../_com/_DAO.php";

$juegoId = $_REQUEST["juegoId"];

 DAO::aniadirJuegoWishList($juegoId, $_SESSION["id"]);



?>