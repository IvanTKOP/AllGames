<?php

require_once "../_com/_DAO.php";


if(isset($_REQUEST["buscar"])){
    if ($_REQUEST["buscar"] != "" && $_REQUEST["buscar"] != null) {
        $nombre = DAO::buscarJuegoPorNombre($_REQUEST["buscar"]);
        echo json_encode($nombre);
    }
}

?>
