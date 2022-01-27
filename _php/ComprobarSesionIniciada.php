<?php

require_once "../_com/_DAO.php";

$sesionIniciada = DAO::haySesionRamIniciada();
$sesionCookie = DAO::intentarCanjearSesionCookie();


if ($sesionIniciada && $sesionCookie) {
    $resultado = true;
} else if (!$sesionIniciada && $sesionCookie) {
    $arrayUsuario = DAO::usuarioObtenerPorCookie($_COOKIE["codigoCookie"]);
    DAO::establecerSesionRam($arrayUsuario);
    $resultado = true;
} else if ($sesionIniciada && !$sesionCookie) {
    $resultado = true;
} else {
    $resultado = false;
}

echo json_encode($resultado);


?>