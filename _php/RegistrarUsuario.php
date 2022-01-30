<?php

require_once "../_com/_DAO.php";


$arrayUsuario["nombre"] = $_REQUEST["nombre"];
$arrayUsuario["apellidos"] = $_REQUEST["apellidos"];
$arrayUsuario["identificador"] = $_REQUEST["identificador"];
$arrayUsuario["email"] = $_REQUEST["email"];
$arrayUsuario["contrasenna"] = $_REQUEST["contrasenna"];

// comprobamos si identificador esta disponible
$usuarioEncontrado = DAO::usuarioComprobarDisponible($arrayUsuario["identificador"]);

if (!$usuarioEncontrado) {
    DAO::usuarioCrear($arrayUsuario);
    $resultado = true;
    
} else {
    $resultado = false;
}

echo json_encode($resultado);

?>
