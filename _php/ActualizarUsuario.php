<?php

require_once "../_com/_DAO.php";

$arrayUsuario["id"] = $_SESSION["id"];
$arrayUsuario["identificador"] = $_REQUEST["identificador"];
$arrayUsuario["email"] = $_REQUEST["email"];
$arrayUsuario["contrasenna"] = $_REQUEST["contrasenna"];

if($arrayUsuario["identificador"] == $_SESSION["identificador"]) { // el usuario no cambia identificador
    $usuarioCreado= DAO::usuarioActualizar($arrayUsuario);
    $resultado = true;

} else { // comprobamos identificador disponible

    $usuarioEncontrado = DAO::usuarioComprobarDisponible($arrayUsuario["identificador"]);

    if (!$usuarioEncontrado) {
        DAO::usuarioActualizar($arrayUsuario);
        $resultado = true;
    
    } else {
        $resultado = false;
    }
}

echo json_encode($resultado);

?>
