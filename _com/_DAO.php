<?php

require_once "Clases.php";
require_once "Varios.php";

session_start();

class DAO
{
    private static $pdo = null;

    private static function obtenerPdoConexionBD()
    {
        $servidor = "localhost";
        $identificador = "root";
        $contrasenna = "";
        $bd = "allGames"; 
        $opciones = [
            PDO::ATTR_EMULATE_PREPARES => false, 
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, 
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, 
        ];

        try {
            $pdo = new PDO("mysql:host=$servidor;dbname=$bd;charset=utf8", $identificador, $contrasenna, $opciones);
        } catch (Exception $e) {
            error_log("Error al conectar: " . $e->getMessage());
            echo "\n\nError al conectar:\n" . $e->getMessage();
            header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        }

        return $pdo;
    }

    private static function ejecutarConsulta(string $sql, array $parametros): array
    {
        if (!isset(self::$pdo)) {
            self::$pdo = self::obtenerPdoConexionBd();
        }

        $select = self::$pdo->prepare($sql);
        $select->execute($parametros);
        $rs = $select->fetchAll();

        return $rs;
    }

    private static function ejecutarInsert(string $sql, array $parametros): ?int
    {
        if (!isset(self::$pdo)) {
            self::$pdo = self::obtenerPdoConexionBd();
        }

        $insert = self::$pdo->prepare($sql);
        $sqlConExito = $insert->execute($parametros);

        if (!$sqlConExito) {
            return null;
        } else {
            return self::$pdo->lastInsertId();
        }

    }


    private static function ejecutarUpdel(string $sql, array $parametros): ?int
    {
        if (!isset(self::$pdo)) {
            self::$pdo = self::obtenerPdoConexionBd();
        }

        $updel = self::$pdo->prepare($sql);
        $sqlConExito = $updel->execute($parametros);

        if (!$sqlConExito) {
            return null;
        } else {
            return $updel->rowCount();
        }

    }

    /* USUARIO */

private static function usuarioCrearDesdeRs(array $rs): Usuario
{
    return new Usuario($rs[0]["id"], $rs[0]["nombre"], $rs[0]["apellidos"], $rs[0]["email"], $rs[0]["identificador"], $rs[0]["contrasenna"],  $rs[0]["codigoCookie"]);
}

public static function usuarioObtener(string $identificador, string $contrasenna_sinHash): ?Usuario
{
    $contrasenna_hash = self::ejecutarConsulta(
      "SELECT * FROM usuario WHERE identificador=?",
       [$identificador]
    );

    if($contrasenna_hash){
        if(password_verify($contrasenna_sinHash, $contrasenna_hash[0]["contrasenna"])){
            $contrasenna = $contrasenna_hash[0]["contrasenna"];
            $rs = self::ejecutarConsulta(
                "SELECT * FROM usuario WHERE identificador=? AND contrasenna =?",
                [$identificador, $contrasenna]
            );
        }else{
            $rs = false;
        }
    }else{
        $rs = false;
    }
    if ($rs){
        return self::usuarioCrearDesdeRS($rs[0]);
    } else {
        return null;
    }
}

public static function usuarioObtenerPorId(int $id): ?Usuario
{
    $rs = self::ejecutarConsulta("SELECT * FROM usuario WHERE id=?", [$id]);
    if ($rs) {
        return self::usuarioCrearDesdeRs($rs);
    } else {
        return null;
    }

}    

public static function usuarioObtenerPorIdentificador($identificador): bool
    {
        $rs = self::ejecutarConsulta("SELECT * FROM usuario WHERE identificador=? ",
            [$identificador]);
        if ($rs) {
            return true;
        } else {
            return false;
        }
    }

public static function usuarioObtenerPorContrasenna(string $identificador, string $contrasenna): ?Usuario
    {

    $rs =  self::ejecutarConsulta(
        "SELECT * FROM Usuario WHERE identificador=? AND BINARY contrasenna=?",
        [$identificador, $contrasenna]
    );

    if ($rs) {
        return self::usuarioCrearDesdeRs($rs);
    } else {
        return null;
    }
}

public static function usuarioObtenerPorCookie(string $codigoCookie): ?Usuario
    {
        $rs = self::ejecutarConsulta(
            "SELECT * FROM usuario WHERE codigoCookie=?",
            [$codigoCookie]
        );
        if ($rs) return self::usuarioCrearDesdeRS($rs[0]);
        else return null;
    }

public static function usuarioCrear(string $nombre, string $apellidos, string $email, string $identificador, string $contrasenna, string  $codigoCookie): void
{
    $hash_contrasenna= password_hash($contrasenna, PASSWORD_DEFAULT);

    self::ejecutarUpdel("INSERT INTO usuario (nombre, apellidos, email, identificador, contrasenna, codigoCookie) VALUES (?,?,?,?,?,?);",
        [$nombre, $apellidos, $email, $identificador, $hash_contrasenna, $codigoCookie]);
}

public static function usuarioBorrar(): void
{
    self::ejecutarUpdel(
        "DELETE FROM usuario WHERE id=?",
        [$_SESSION["id"]]
    );

}




/* SESIONES */

public static function sessionStartSiNoLoEsta()
{
    if (!isset($_SESSION)) {
        session_start();
    }
}

public static function establecerSesionRam($arrayUsuario)
{

    $_SESSION["id"] = $arrayUsuario->getId();

    $_SESSION["nombre"] = $arrayUsuario->getNombre();
    $_SESSION["apellidos"] = $arrayUsuario->getApellidos();
    $_SESSION["identificador"] = $arrayUsuario->getidentificador();
    $_SESSION["email"] = $usuario->getEmail();
}

public static function haySesionRamIniciada()
{
    self::sessionStartSiNoLoEsta();
    return isset($_SESSION["id"]);
}

public static function destruirSesionRamYCookie()
{
    session_destroy();
    unset($_SESSION); // para dejarla como si nunca hubiese existido
}

public static function generarCookieRecordar()
{
    $arrayUsuario = DAO::usuarioObtener($_REQUEST["identificador"], $_REQUEST["contrasenna"]);
    $codigoCookie = generarCadenaAleatoria(32);

    self::ejecutarConsulta(
        "UPDATE usuario SET codigoCookie=? WHERE identificador=?",
        [$codigoCookie, $arrayUsuario->getIdentificador()]
    );


    $arrayCookies["identificador"] = setcookie("identificador", $arrayUsuario->getIdentificador(), time() + 60 * 60);
    $arrayCookies["codigoCookie"] = setcookie("codigoCookie", $codigoCookie, time() + 60 * 60);
}

public static function borrarCookieRecordar()
{
    $arrayUsuario = DAO::usuarioObtener($_REQUEST["identificador"], $_REQUEST["contrasenna"]);

    self::ejecutarConsulta(
        "UPDATE usuario SET codigoCookie=NULL WHERE identificador=?",
        [$arrayUsuario->getIdentificador()]
    );
    $identificador = $arrayUsuario->getIdentificador();
    setcookie("identificador", $identificador, time() - 3600);

    unset($_COOKIE["codigoCookie"]);
    setcookie("codigoCookie", "", time() - 3600);
    unset($_COOKIE["identificador"]);

}

public static function intentarCanjearSesionCookie(): bool
{
    if ((isset($_COOKIE["identificador"])) && (isset($_COOKIE["codigoCookie"]))) {

        $rs = self::ejecutarConsulta(
            "SELECT * FROM usuario WHERE identificador=? AND BINARY codigoCookie=?",
            [$_COOKIE["identificador"], $_COOKIE["codigoCookie"]]
        );

        $identificador = $rs[0]["identificador"];
        $codigoCookie = $rs[0]["codigoCookie"];

        if ($rs) {
            return true;
        } else {
            setcookie("identificador", $identificador, time() - 3600);
            setcookie("codigoCookie", $codigoCookie, time() - 3600);
            return false;
        }

    }
    return false;

}
























}


?>