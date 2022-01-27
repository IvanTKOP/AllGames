<?php

require_once "../_com/_DAO.php";


$arrayUsuario["nombre"] = $_REQUEST["nombre"];
$arrayUsuario["apellidos"] = $_REQUEST["apellidos"];
$arrayUsuario["identificador"] = $_REQUEST["identificador"];
$arrayUsuario["email"] = $_REQUEST["email"];
$arrayUsuario["contrasenna"] = $_REQUEST["contrasenna"];


$usuarioDisponible = DAO::usuarioComprobarDisponible($arrayUsuario["identificador"]);

if (!$usuarioDisponible) {
    $usuarioCreado= DAO::usuarioCrear($arrayUsuario);
    $resultado = true;
    
} else {
    $resultado = false;
}

echo json_encode($resultado);

?>
