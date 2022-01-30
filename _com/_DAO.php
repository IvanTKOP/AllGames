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
    return new Usuario($rs["id"], $rs["nombre"], $rs["apellidos"], $rs["email"], $rs["identificador"], $rs["contrasenna"],  $rs["codigoCookie"]);
}

public static function usuarioObtener(string $identificador, string $contrasenna_sinHash): ?Usuario
{
    $contrasenna_hash = self::ejecutarConsulta(
      "SELECT * FROM usuario WHERE identificador=?",
       [$identificador]
    );

    if($contrasenna_hash){
        if(password_verify($contrasenna_sinHash, $contrasenna_hash[0]["contrasenna"])) {
            $contrasenna = $contrasenna_hash[0]["contrasenna"];
            $rs = self::ejecutarConsulta(
                "SELECT * FROM usuario WHERE identificador=? AND contrasenna =?",
                [$identificador, $contrasenna]
            );
        }else {
            $rs = false;
        }
    }else {
        $rs = false;
    }

    if ($rs) {
        return self::usuarioCrearDesdeRS($rs[0]);
    } else {
        return null;
    }
}

public static function usuarioObtenerPorId(int $id): ?Usuario
{
    $rs = self::ejecutarConsulta("SELECT * FROM usuario WHERE id=?", [$id]);
    if ($rs) {
        return self::usuarioCrearDesdeRs($rs[0]);
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

public static function usuarioCrear(array $arrayUsuario): void
{
    $hash_contrasenna= password_hash($arrayUsuario["contrasenna"], PASSWORD_DEFAULT);

    self::ejecutarActualizacion("INSERT INTO usuario (nombre, apellidos, email, identificador, contrasenna, codigoCookie) VALUES (?,?,?,?,?,NULL)",
        [$arrayUsuario["nombre"], $arrayUsuario["apellidos"], $arrayUsuario["email"], $arrayUsuario["identificador"], $hash_contrasenna]);
}

public static function usuarioBorrar(): void
{
    self::ejecutarUpdel(
        "DELETE FROM usuario WHERE id=?",
        [$_SESSION["id"]]
    );

}

public static function usuarioActualizar(array $arrayUsuario): void
{
    $hash_contrasenna= password_hash($arrayUsuario["contrasenna"], PASSWORD_DEFAULT);

    self::ejecutarActualizacion("UPDATE usuario SET identificador = ?, email = ?, contrasenna = ? WHERE id=?",[$arrayUsuario["identificador"], $arrayUsuario["email"], $hash_contrasenna, $arrayUsuario["id"]]);
}

public static function usuarioComprobarAdministrador(int $id)
{
    $rs = self::ejecutarConsulta(
        "SELECT administrador FROM usuario WHERE id=?",
        [$id]
    );
    if ($rs[0]["administrador"]==1) return true;
    else return false;
}

public static function usuarioComprobarDisponible(string $identificador): array
{
    return self::ejecutarConsulta(
        "SELECT identificador FROM usuario WHERE identificador=?",
        [$identificador]
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
    $_SESSION["email"] = $arrayUsuario->getEmail();
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

    if (isset($_COOKIE["codigoCookie"])) {
        unset($_COOKIE["codigoCookie"]);
        setcookie("codigoCookie", "", time() - 3600);
    }

    if (isset($_COOKIE["identificador"])) {
        unset($_COOKIE["identificador"]);
        setcookie("identificador", "", time() - 3600);
    }
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


    $arrayCookies["identificador"] = setcookie("identificador", $arrayUsuario->getIdentificador(), time() + 3600);
    $arrayCookies["codigoCookie"] = setcookie("codigoCookie", $codigoCookie, time() + 3600);
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

    public static function juegoObtenerPorPlataforma(string $plataforma): ?array
    {
      $juegos = [];
      $rs = self::ejecutarConsulta(
          "SELECT juego.* FROM juego 
          INNER JOIN plataforma_juego ON juego.id = plataforma_juego.juegoId 
          LEFT JOIN plataforma ON plataforma_juego.plataformaId = plataforma.id 
          WHERE plataforma.nombre = ?",
          [$plataforma]
      );


      foreach ($rs as $fila) {
        $juego = self::juegoCrearDesdeRS($fila);
        array_push($juegos, $juego);
    }


    if ($rs) {
        return $juegos;
    } else {
        return null;
    }
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

    
    /* GENERO */

    private static function generoCrearDesdeRs(array $fila): Genero
    {
        return new Genero($fila["id"], $fila["nombre"]);
    }

    private static function genero_JuegoCrearDesdeRs(array $fila): Genero_Juego
    {
        return new Genero_Juego($fila["generoId"], $fila["juegoId"]);
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

    public static function generoObtenerPorJuegoId($juegoId)
  {
      $datos = [];
      
      $rs = self::ejecutarConsulta(
          "SELECT * FROM genero_juego g, juego j WHERE juegoId = ? AND g.juegoId = j.id",
          [$juegoId]
      );


      foreach ($rs as $fila) {
          $genero = self::genero_JuegoCrearDesdeRs($fila);
          array_push($datos, $genero);
      }


      if ($rs) {
          return $datos;
      } else {
          return null;
      }
  }


    /*  PLATAFORMA  */

    private static function plataformaCrearDesdeRS(array $plataforma): Plataforma
    {
        return new Plataforma($plataforma["id"], $plataforma["nombre"], $plataforma["logo"]);
    }

    private static function plataforma_JuegoCrearDesdeRS(array $plataforma): Plataforma_Juego
    {
        return new Plataforma_Juego($plataforma["plataformaId"], $plataforma["juegoId"]);
    }

    public static function plataformaObtenerPorId(int $id)
    {
        $rs = self::ejecutarConsulta("SELECT * FROM plataforma WHERE id=?", [$id]);
        if ($rs) return self::plataformaCrearDesdeRs($rs[0]);
        else return null;
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

    public static function plataformaObtenerPorJuegoId($juegoId)
    {
        $datos = [];
        
        $rs = self::ejecutarConsulta(
            "SELECT * FROM plataforma_juego p, juego j WHERE juegoId = ? AND p.juegoId = j.id",
            [$juegoId]
        );
  
  
        foreach ($rs as $fila) {
            $plataforma = self::plataforma_JuegoCrearDesdeRs($fila);
            array_push($datos, $plataforma);
        }
  
  
        if ($rs) {
            return $datos;
        } else {
            return null;
        }
    }

    /*  WISHLIST  */

    public static function aniadirJuegoWishList(int $juegoId, int $usuarioId)
    {
        $comprobar= self::ejecutarConsulta("SELECT juegoId FROM wishlist WHERE usuarioId = ? AND juegoId = ?", [$usuarioId, $juegoId]);

        if ($comprobar == null) {
            $rs = self::ejecutarActualizacion("INSERT INTO wishlist (juegoId, usuarioId) VALUES (?,?);", [$juegoId, $usuarioId]);   
        }
    }

    public static function borrarJuegoWishList(int $juegoId, int $usuarioId)
    {
        $comprobar= self::ejecutarConsulta("SELECT juegoId FROM wishlist WHERE usuarioId = ? AND juegoId = ?", [$usuarioId, $juegoId]);

        if($comprobar){
            $rs = self::ejecutarActualizacion("DELETE FROM wishlist WHERE juegoId=? && usuarioId=?;", [$juegoId, $usuarioId]);   
        }
    }

    public static function obtenerWishList(int $usuarioId): ?array
    {
        $juegos = [];

        $rs = self::ejecutarConsulta("SELECT juegoId FROM wishlist WHERE usuarioId = ?",
        [$usuarioId]);

        if ($rs) {
            foreach ($rs as $fila) {    
                $juego = self::juegoObtenerPorId($fila["juegoId"]);
                array_push($juegos, $juego);
            }

            return $juegos;
        }else {
            return null;
        }
    }


    /* BUSCAR/FILTRAR */

  public static function buscarJuegoPorNombre(string $nombre): ?array
  {
    $cadena = "%" . $nombre . "%";  
    $juegos = [];
    
    $rs = self::ejecutarConsulta(
          "SELECT * FROM juego WHERE nombre LIKE ?",
          [$cadena]
      );


      foreach ($rs as $fila) {
          $juego = self::juegoCrearDesdeRS($fila);
          array_push($juegos, $juego);
      }


      if ($rs) {
          return $juegos;
      } else {
          return null;
      }
  }

/*

  public static function buscarJuegoPorGenero(string $nombre): ?array
  {
      $juegos = [];
      
      $rs = self::ejecutarConsulta(
          "SELECT juego.* FROM juego 
          INNER JOIN genero_juego ON juego.id = genero_juego.juegoId 
          LEFT JOIN genero ON genero_juego.generoId = genero.id 
          WHERE genero.nombre LIKE '%'+?+'%'",
          [$nombre]
      );


      foreach ($rs as $fila) {
          $juego = self::juegoCrearDesdeRS($fila);
          array_push($juegos, $juego);
      }


      if ($rs) {
          return $juegos;
      } else {
          return null;
      }
  }
*/
 
    /*  RESENIA  */
    
    private static function reseniaCrearDesdeRS(array $resenia): Resenia
{
    return new Resenia($resenia["id"], $resenia["valoracion"], $resenia["mensaje"], $resenia["fecha"], $resenia["juegoId"], $resenia["usuarioId"]);
}

    public static function reseniasObtenerPorJuegoId($juegoId)
    {

        $resenias = [];

        $rs = self::ejecutarConsulta(
            "SELECT * FROM resenia WHERE juegoId = ? ORDER BY fecha ASC",
            [$juegoId]
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

    public static function insertarResenia(int $valoracion, string $mensaje, int $juegoId, int $usuarioId)
    {
        $fecha = obtenerFecha();

        if ($mensaje != NULL && $mensaje != "") { 
            self::ejecutarActualizacion("INSERT INTO resenia (valoracion, mensaje, fecha, juegoId, usuarioId) VALUES (?, ?, ?, ?, ?);",
                [$valoracion, $mensaje, $fecha, $juegoId, $usuarioId]);
        }


    }

    public static function reseniaObtenerUltimaInsertada()
    {
        $rs = self::ejecutarConsulta(
            "SELECT * FROM resenia WHERE id IN(SELECT MAX(id) FROM resenia)",
            []
        );

        if ($rs) return self::reseniaCrearDesdeRs($rs[0]);
            else return null;
    }


    public static function reseniaObtenerPorId($reseniaId) 
    {
        $rs = self::ejecutarConsulta("SELECT * FROM resenia WHERE id=?", [$reseniaId]);

        if ($rs) return self::reseniaCrearDesdeRS($rs[0]);
        else return null;
    }

/*  PEDIDO  */

    private static function pedidoCrearDesdeRS(array $pedido): Pedido
    {
       
        return new Pedido($pedido["id"], $pedido["usuarioId"], $pedido["gameKey"], $pedido["fechaPedido"], $pedido["tiempoAlquiler"], $pedido["comprado"]);
    }

    public static function pedidoCrear(int $usuarioId): array
    {

      $rs= self::ejecutarConsulta("SELECT * FROM pedido WHERE usuarioId = ? AND fechaPedido IS NULL", [$usuarioId]);

      if($rs) {
        return self::carritoObtenerUsuarioId($usuarioId);
      } else {
        return self::ejecutarConsulta("INSERT INTO pedido (usuarioId, gamekey, fechaPedido, tiempoAlquiler, comprado) VALUES (?,'0', NULL , 0, 0)", 
            [$usuarioId]
        );
      }
    }

    public static function pedidoConfirmar(int $pedidoId)
    {
        $fecha = obtenerFecha();
        $gamekey= generarCadenaAleatoria(12);

       self::ejecutarActualizacion("UPDATE pedido SET fechaPedido = ?, gamekey = ?  WHERE id=? ",
         [$fecha, $gamekey, $pedidoId]);

       
    }

    public static function pedidoObtenerPorId(int $id)
    {
        $rs = self::ejecutarConsulta("SELECT * FROM pedido WHERE id=?", [$id]);

        if ($rs) return self::pedidoCrearDesdeRS($rs[0]);
        else return null;
    }

    public static function pedidoObtenerPorUsuarioId(int $usuarioId)
    {
        $datos = [];
        $rs = self::ejecutarConsulta("SELECT * FROM pedido WHERE usuarioId=? AND fechaPedido IS NOT NULL", [$usuarioId]);
        
        if ($rs){
            foreach ($rs as $fila){
                $pedido= self::pedidoCrearDesdeRS($fila);
                array_push($datos, $pedido);
            }
    
         return $datos;
        
        } else{
            return null;
        }
    }

    public static function pedidoCarritoObtenerPorUsuarioId(int $usuarioId)
    {
        $rs = self::ejecutarConsulta("SELECT * FROM pedido WHERE Id = (SELECT MAX(Id) FROM pedido WHERE usuarioId=?)",
        [$usuarioId]);
      
        if ($rs) return self::pedidoCrearDesdeRS($rs[0]);
        else return null;
    }


/*  CARRITO  */

    private static function carritoCrearDesdeRS(array $fila): Carrito
    {
        return new Carrito($fila["pedidoId"], $fila["juegoId"]);
    }


    public static function carritoAgregarJuego(int $pedidoId, int $juegoId): void
    {
        $rs = self::ejecutarConsulta(
            "SELECT * FROM carrito WHERE juegoId= ? AND pedidoId = ?",
            [$juegoId, $pedidoId]    
        );

        if (!$rs) {
            self::ejecutarActualizacion(
                "INSERT INTO carrito (pedidoId, juegoId) VALUES (?,?) ",
                [$pedidoId, $juegoId]
            );
            
        }
    }

    public static function carritoObtenerUsuarioId(int $usuarioId)
    {

        $datos = [];
        $rs = self::ejecutarConsulta(
            "SELECT * FROM carrito c, pedido p WHERE usuarioId = ? AND c.pedidoId = p.id AND p.fechaPedido IS NULL",
            [$usuarioId]
        );
        
        foreach ($rs as $fila){
            $carrito= self::carritoCrearDesdeRS($fila);
            array_push($datos, $carrito);
        }

        return $datos;
    }

    public static function carritoEliminar($pedidoId, $juegoId)
        {
            self::ejecutarActualizacion(
                "DELETE from carrito WHERE pedidoId=? AND juegoId=?",
                [$pedidoId, $juegoId]);
        }

    public static function carritoObtenerPorPedidoId($pedidoId)
    {
        $datos = [];
        $rs = self::ejecutarConsulta("SELECT * FROM carrito c,pedido p WHERE c.pedidoId = ? 
                                        AND c.pedidoId = p.id",
            [$pedidoId]
        );

        if($rs){
            foreach ($rs as $fila) {
                $carrito = self::carritoCrearDesdeRS($fila);
                array_push($datos, $carrito);
            }
        
            return $datos;
        } else {

            return null;
        }
    }



}


?>