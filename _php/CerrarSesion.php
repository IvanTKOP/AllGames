<?php

require_once "../_com/_DAO.php";

$sesionIniciada = DAO::haySesionRamIniciada();
$sesionCookie = DAO::intentarCanjearSesionCookie();

if (!$sesionIniciada && !$sesionCookie) {
    redireccionar("../_html/sesion-inicio-formulario.html");
}

DAO::destruirSesionRamYCookie();

redireccionar("../_html/sesion-inicio-formulario.html");

?>
