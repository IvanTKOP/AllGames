<?php

require_once "../_com/_DAO.php";

$identificador = $_REQUEST["identificador"];
$contrasenna = $_REQUEST["contrasenna"];
$recuerdame = $_REQUEST["recuerdame"];

$arrayUsuario= (DAO::usuarioObtener($identificador, $contrasenna));

if ($arrayUsuario != null) { 
    $resultado = true;
    DAO::establecerSesionRam($arrayUsuario);

    if ($recuerdame=="true") {
        DAO::generarCookieRecordar();
    } else {
        DAO::borrarCookieRecordar();
    }
    
} else {
    $resultado = false;
}

echo json_encode($resultado);

?>