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
        if (!isset(Self::$pdo)) {
            Self::$pdo =
            Self::obtenerPdoConexionBD();
        }

        $select = Self::$pdo->prepare($sql);
        $select->execute($parametros);
        $resultado = $select->fetchAll();
        return $resultado;
    }


    private static function ejecutarActualizacion(string $sql, array $parametros): void
    {
        if (!isset(self::$pdo)) {
            self::$pdo = self::obtenerPdoConexionBd();
        }

        $actualizacion = self::$pdo->prepare($sql);
        $actualizacion->execute($parametros);
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


/*  COOKIE  */
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

/* JUEGO */

private static function juegoCrearDesdeRS(array $juego): Juego
    {
        return new Juego($juego["id"], $juego["nombre"], $juego["descripcion"], $juego["portada"], $juego["trailer"], $juego["pegi"], $juego["precio"]);
    }

public static function juegoObtenerPorId(int $id)
    {
        $rs = self::ejecutarConsulta("SELECT * FROM juego WHERE id=?", [$id]);
        if ($rs) return self::juegoCrearDesdeRs($rs[0]);
        else return null;
    }

    public static function juegoObtenerTodos(): array
    {
        $datos = [];
        $rs = self::ejecutarConsulta("SELECT * FROM juego ORDER BY nombre", []);

        foreach ($rs as $fila) {
            $juego =  self::juegoCrearDesdeRs($fila);
            array_push($datos, $juego);
        }

        return $datos;
    }

    public static function juegoAgregar($nombre, $descripcion, $portada, $trailer, $pegi, $precio)
    {
        self::ejecutarActualizacion("INSERT INTO juego (id, nombre, descripcion, portada, trailer, pegi, precio) VALUES (NULL, ?, ?, ?, ?, ?, ?);",
            [$nombre, $descripcion, $portada, $trailer, $pegi, $precio]);
    }

    public static function juegoActualizar(int $id, string $nuevoNombre, string $nuevaDescripcion, string $nuevaPortada, string $nuevoTrailer, string $nuevoPegi, int $nuevoPrecio)
    {
        self::ejecutarActualizacion("UPDATE juego SET nombre = ?, descripcion = ?, portada =?, trailer=?, pegi=?, precio=? WHERE id=?",
            [$nuevoNombre, $nuevaDescripcion, $nuevaPortada,  $nuevoTrailer, $nuevoPegi, $nuevoPrecio, $id]);
    }

    public static function juegoEliminar($id)
    {
        self::ejecutarActualizacion(
            "DELETE from juego WHERE id=?",
            [$id]);
    }

    public static function juegosObtenerWishList(int $usuarioId): ?array
    {
        $juegos = [];
        $rs = self::ejecutarConsulta(
            "SELECT juegoId FROM wishlist 
            WHERE usuarioId LIKE ?",
            [$usuarioId]
        );

        if (!$rs) {
            return null;
        }

        foreach ($rs as $fila) {
            $juego = self::juegoObtenerPorId($fila);
            array_push($juegos, $juego);
        }

        return $juegos;
    }

    /* GENERO */

    private static function generoCrearDesdeRs(array $fila): Genero
    {
        return new Genero($fila["id"], $fila["nombre"]);
    }

    public static function generoObtenerPorId(int $id)
    {
        $rs = self::ejecutarConsulta("SELECT * FROM genero WHERE id=?", [$id]);
        if ($rs) return self::generoCrearDesdeRs($rs[0]);
        else return null;
    }

    public static function generoObtenerTodos(): array
    {
        $datos = [];
        $rs = self::ejecutarConsulta("SELECT * FROM genero ORDER BY nombre", []);

        foreach ($rs as $fila) {
            $genero =  self::generoCrearDesdeRs($fila);
            array_push($datos, $genero);
        }

        return $datos;
    }

  /*  public static function generoAgregar($nombre)
    {
        self::ejecutarActualizacion("INSERT INTO genero (id, nombre) VALUES (NULL, ?);",
            [$nombre]);
    }

    public static function generoActualizar(int $id, string $nuevoNombre)
    {
        self::ejecutarActualizacion("UPDATE genero SET nombre = ? WHERE id=?",
            [$nuevoNombre, $id]);
    }

    public static function generoEliminar($id)
    {
        self::ejecutarActualizacion(
            "DELETE from genero WHERE id=?",
            [$id]);
    }

    */

    /*  PEDIDO  */

    private static function pedidoCrearDesdeRS(array $pedido): Pedido
{
    return new Pedido($pedido["id"], $pedido["usuarioId"], $pedido["gamekey"], $pedido["fechaPedido"], $pedido["tiempoAlquiler"], $pedido["comprado"]);
}

    public static function pedidoCrear(int $usuarioId, $tiempoAlquiler, $comprado): Pedido
    {
        $fechaPedido= obtenerFecha();
        $gamekey= generarCadenaAleatoria(12);

        self::ejecutarActualizacion("INSERT INTO pedido (id, usuarioId, gamekey, fechaPedido, tiempoAlquiler, comprado) VALUES (NULL, ?, ?, ?, ?, ?) ", [$usuarioId, $gamekey, $fechaPedido, $tiempoAlquiler, $comprado]);
    }

    public static function pedidoObtenerPorId(int $id)
    {
        $rs = self::ejecutarConsulta("SELECT * FROM pedido WHERE id=?", [$id]);
        if ($rs) return self::pedidoCrearDesdeRs($rs[0]);
        else return null;
    }

    /*  PLATAFORMA  */

    private static function plataformaCrearDesdeRS(array $plataforma): Plataforma
    {
        return new Plataforma($plataforma["id"], $plataforma["nombre"], $plataforma["logo"]);
    }

    public static function plataformaObtenerPorNombre(string $nombre): ?Plataforma
    {
        $rs = self::ejecutarConsulta(
            "SELECT * FROM plataforma WHERE nombre LIKE ?",
            [$nombre]
        );
        if ($rs) return self::plataformaCrearDesdeRS($rs[0]);
        else return null;
    }

    public static function plataformaObtenerPorJuegoId(int $id): ?array
    {

        $plataformas = [];

        $rs = self::ejecutarConsulta(
            "SELECT plataforma.* FROM plataforma 
            INNER JOIN plataforma_juego ON plataforma.id = plataforma_juego.plataformaId 
            LEFT JOIN juego ON plataforma_juego.juegoId = juego.id 
            WHERE juego.id = ?",
            [$id]
        );

        foreach ($rs as $fila) {
            $plataforma = self::plataformaCrearDesdeRS($fila);
            array_push($plataformas, $plataforma);
        }


        if ($rs) {
            return $plataformas;
        } else {
            return null;
        }
    }

    /*  WISHLIST  */

    public static function aniadirJuegoWishList(int $juegoId, int $usuarioId)
    {
        $comprobar= self::ejecutarConsulta("SELECT ? FROM wishlist WHERE usuarioId = ?", [$juegoId, $usuarioId]);

        if($comprobar->rowCount() == 0){
            $rs = self::ejecutarActualizacion("INSERT INTO wishlist (juegoId, usuarioId) VALUES (?,?);", [$juegoId, $usuarioId]);   
        }
    }

    public static function borraJuegoWishList(int $juegoId, int $usuarioId)
    {
        $comprobar= self::ejecutarConsulta("SELECT ? FROM wishlist WHERE usuarioId = ?", [$juegoId, $usuarioId]);

        if($comprobar->rowCount() != 0){
            $rs = self::ejecutarUpdel("DELETE FROM wishlist WHERE juegoId=? && usuarioId=?;", [$juegoId, $usuarioId]);   
        }
    }

    /*  RESENIA  */
    
    private static function reseniaCrearDesdeRS(array $resenia): Resenia
{
    return new Resenia($resenia["id"], $resenia["valoracion"], $resenia["mensaje"], $resenia["fecha"], $resenia["juegoId"], $resenia["usuarioId"]);
}

public static function reseniasObtener(int $id): ?array
{

    $resenias = [];

    $rs = self::ejecutarConsulta(
        "SELECT * FROM resenia WHERE juegoId = ? ORDER BY fecha ASC",
        [$id]
    );

    foreach ($rs as $fila) {
        $resenia = self::reseniaCrearDesdeRS($fila);
        array_push($resenias, $resenia);
    }

    if ($rs) {
        return $resenias;
    } else {
        return null;
    }
}

public static function insertarResenia(int $valoracion, string $mensaje, int $juegoId, int $usuarioId): bool
{
    $fecha = obtenerFecha();

    if ($mensaje != NULL && $mensaje != "") { 
        self::ejecutarActualizacion("INSERT INTO resenia (valoracion, mensaje, fecha, juegoId, usuarioId) VALUES (?, ?, ?, ?, ?);",
            [$valoracion, $mensaje, $fecha, $juegoId, $usuarioId]);
    }
}

public static function reseniaObtenerUltimaInsertada(): ?Resenia
{
    $rs = self::ejecutarConsulta(
        "SELECT * FROM resenia WHERE id IN(SELECT MAX(id) FROM resenia)",
        []
    );

    if ($rs) return self::reseniaCrearDesdeRs($rs[0]);
        else return null;
}

/*  CARRITO  */


private static function carritoCrearDesdeRS(array $carrito): Carrito
{
    return new Carrito($carrito["pedidoId"], $carrito["juegoId"], $carrito["unidades"]);
}

public static function carritoAgregarJuego(int $pedidoId, int $juegoId, int $unidades): void
{
    /*$comprobar = self::ejecutarConsulta("SELECT * FROM carrito WHERE juegoId= ? AND pedidoId = ?");

    if($comprobar->rowCount() != 0){*/
    $pedidoId = self::pedidoObtenerPorId($pedidoId);
    $unidades += 1;
    self::ejecutarActualizacion(
        "INSERT INTO carrito (pedidoId, juegoId, unidades) VALUES (?,?,?) ",
        [$pedidoId, $juegoId, $unidades]
    );
}

public static function carritoObtenerUsuarioId(int $usuarioId): array
    {

        $datos = [];
        $rs = self::ejecutarConsulta(
            "SELECT * FROM carrito c, pedido p WHERE usuarioId = ? AND c.pedidoId = p.pedidoId AND p.fechaPedido IS current_timestamp()",
            [$usuarioId]
        );

        foreach ($rs as $fila) {
            $juego = self::carritoCrearDesdeRs($fila);
            array_push($datos, $juego);
        }

        return $datos;
    }

    public static function carritoObtenerJuego(int $juegoId): string
    {
        $rs = self::ejecutarConsulta(
            "SELECT id FROM juego WHERE juegoId=?",
            [$juegoId]
        );
        return $rs[0]["id"];
    }

    public static function carritoObtenerPrecio(int $juegoId): string
    {
        $rs = self::ejecutarConsulta(
            "SELECT precio FROM juego WHERE juegoId=?",
            [$juegoId]
        );
        return $rs[0]["precio"];
    }

    public static function carritoModificarUnidades(int $unidades, int $juegoId): string
    {
        return $rs = self::ejecutarActualizacion(
            "UPDATE carrito SET unidades = ? WHERE juegoId=?",
            [$unidades,$juegoId]
         );
       
    }

    public static function carritoEliminar($pedidoId,$juegoId): bool
    {
        $return = self::ejecutarActualizacion("DELETE FROM carrito WHERE pedidoId=? AND juegoId=?",
        [$pedidoId,$juegoId]);
        
        if ($return) {
            return true;
        } else {
            return false;
        }
    }










}


?>