<?php

abstract class Dato
{
}

trait Identificable
{
    protected $id;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id)
    {
        $this->id = $id;
    }
}

/* CLASE USUARIO */
class Usuario extends Dato implements JsonSerializable
{
    use Identificable;
    private $nombre;
    private $apellidos;
    private $email;
    private $indentificador;
    private $contrasenna;
    private $codigoCookie;
    private $administrador;

    public function __construct($id, $nombre, $apellidos, $email, $indentificador, $contrasenna, $codigoCookie)
    {
        $this->id = ($id);
        $this->setNombre($nombre);
        $this->setApellidos($apellidos);
        $this->setEmail($email);
        $this->setIdentificador($indentificador);
        $this->setContrasenna($contrasenna);
        $this->setCodigoCookie($codigoCookie);
    }

    public function jsonSerialize()
    {
        return [
            "id" => $this->id,
            "nombre" => $this->nombre,
            "apellidos" => $this->apellidos,
            "email" => $this->email,
            "identificador" => $this->identificador,
            "contrasenna" => $this->contrasenna,
            "codigoCookie" => $this->codigoCookie,
        ];

    }

    /* GETTERS USUARIO */
    public function getNombre()
    {return $this->nombre;}
    public function getApellidos()
    {return $this->apellidos;}
    public function getEmail()
    {return $this->email;}
    public function getIdentificador()
    {return $this->identificador;}
    public function getContrasenna()
    {return $this->contrasenna;}
    public function getCodigoCookie()
    {return $this->codigoCookie;}

    /* SETTERS USUARIO */
    public function setNombre($nombre)
    {$this->nombre = $nombre;}
    public function setApellidos($apellidos)
    {$this->apellidos = $apellidos;}
    public function setEmail($email)
    {$this->email = $email;}
    public function setIdentificador($indentificador)
    {$this->identificador = $indentificador;}
    public function setContrasenna($contrasenna)
    {$this->contrasenna = $contrasenna;}
    public function setCodigoCookie($codigoCookie)
    {$this->codigoCookie = $codigoCookie;}
}



/* CLASE JUEGO */

class Juego extends Dato implements JsonSerializable
{
    use Identificable;

    private $nombre;

    private $descripcion;

    private $portada;

    private $trailer;
     
    private $pegi;

    private $precio;


    public function __construct($id, $nombre, $descripcion, $portada, $trailer, $pegi, $precio)
    {
        $this->setId($id);
        $this->setNombre($nombre);
        $this->setDescripcion($descripcion);
        $this->setPortada($portada);
        $this->setTrailer($trailer);
        $this->setPegi($pegi);
        $this->setPrecio($precio);
    }

    public function jsonSerialize()
    {
        return [
            "id" => $this->id,
            "nombre" => $this->nombre,
            "descripcion" => $this->descripcion,
            "portada" => $this->portada,
            "trailer" => $this->trailer,
            "pegi" => $this->pegi,
            "precio" => $this->precio,
        ];
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    }

    public function getPortada()
    {
        return $this->portada;
    }

    public function setPortada($portada)
    {
        $this->portada = $portada;
    }

    public function getTrailer()
    {
        return $this->trailer;
    }

    public function setTrailer($trailer)
    {
        $this->trailer = $trailer;
    }

    public function getPegi()
    {
        return $this->pegi;
    }

    public function setPegi($pegi)
    {
        $this->pegi = $pegi;
    }

    public function getPrecio()
    {
        return $this->precio;
    }

    public function setPrecio($precio)
    {
        $this->precio = $precio;
    }

}


/* CLASE PLATAFORMA */

class Plataforma extends Dato implements JsonSerializable
{
    use Identificable;

    private $nombre;

    private $logo;

    public function __construct($id, $nombre, $logo)
    {
        $this->setId($id);
        $this->setNombre($nombre);
        $this->setLogo($logo);
    }

    public function jsonSerialize()
    {
        return [
            "id" => $this->id,
            "nombre" => $this->nombre,
            "logo" => $this->logo
        ];
    }


    public function getNombre() 
    {
        return $this->nombre;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function getLogo() 
    {
        return $this->logo;
    }

    public function setLogo($logo)
    {
        $this->logo = $logo;
    }
}

/* CLASE PLATAFORMA_JUEGO */

class Plataforma_Juego extends Dato implements JsonSerializable
{
    use Identificable;
    private  $plataformaId;
    private  $juegoId;

    public function __construct(int $plataformaId, int $juegoId)
    {
        $this->setPlataformaId($plataformaId);
        $this->setJuegoId($juegoId);
    }

    public function jsonSerialize()
    {
        return [
            "plataformaId" => $this->plataformaId,
            "juegoId" => $this->juegoId,
        ];
    }

    public function getJuegoId(){
        return $this->juegoId;
    }
    public function getPlataformaId(){
        return $this->plataformaId;
    }
    public function setJuegoId($juegoId){
        $this->juegoId = $juegoId;
    }
    public function setPlataformaId($plataformaId){
        $this->plataformaId = $plataformaId;
    }
    
}

/* CLASE GENERO_JUEGO */

class Genero_Juego extends Dato implements JsonSerializable
{
    use Identificable;
    private  $generoId;
    private  $juegoId;

    public function __construct(int $generoId, int $juegoId)
    {
        $this->setGeneroId($generoId);
        $this->setJuegoId($juegoId);
    }

    public function jsonSerialize()
    {
        return [
            "generoId" => $this->generoId,
            "juegoId" => $this->juegoId,
        ];
    }

    public function getJuegoId(){
        return $this->juegoId;
    }
    public function getGeneroId(){
        return $this->generoId;
    }
    public function setJuegoId($juegoId){
        $this->juegoId = $juegoId;
    }
    public function setGeneroId($generoId){
        $this->generoId = $generoId;
    }
    
}


/* CLASE GÉNERO */

class Genero extends Dato implements JsonSerializable
{
    use Identificable;

    private $nombre;

    public function __construct($id, $nombre)
    {
        $this->setId($id);
        $this->setNombre($nombre);
    }

    public function jsonSerialize()
    {
        return [
            "id" => $this->id,
            "nombre" => $this->nombre,
        ];
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }
}


/* CLASE  RESENIA */

class Resenia extends Dato implements JsonSerializable
{
    use Identificable;

    private $valoracion;

    private $mensaje;

    private $fecha;

    private $juegoId;

    private $usuarioId;

    public function __construct($id, $valoracion, $mensaje, $fecha, $juegoId, $usuarioId)
    {
        $this->setId($id);
        $this->setValoracion($valoracion);
        $this->setMensaje($mensaje);
        $this->setFecha($fecha);
        $this->setJuegoId($juegoId);
        $this->setUsuarioId($usuarioId);
    }

    public function jsonSerialize()
    {
        return [
            "id" => $this->id,
            "valoracion" => $this->valoracion,
            "mensaje" => $this->mensaje,
            "fecha" => $this->fecha,
            "juegoId" => $this->juegoId,
            "usuarioId" => $this->usuarioId,
        ];
    }

    
    public function getValoracion()
    {
        return $this->valoracion;
    }

    public function setValoracion($valoracion)
    {
        $this->valoracion = $valoracion;
    }

    public function getMensaje()
    {
        return $this->mensaje;
    }

    public function setMensaje($mensaje)
    {
        $this->mensaje = $mensaje;
    }

    public function getFecha()
    {
        return $this->fecha;
    }

    public function setFecha($fecha)
    {
        $this->fecha = $fecha;
    }

    public function getJuegoId()
    {
        return $this->juegoId;
    }

    public function setJuegoId($juegoId)
    {
        $this->juegoId = $juegoId;
    }

    public function getUsuarioId()
    {
        return $this->usuarioId;
    }

    public function setUsuarioId($usuarioId)
    {
        $this->usuarioId = $usuarioId;
    }
}

class Carrito extends Dato implements JsonSerializable
{
    use Identificable;
    private  $pedidoId;
    private  $juegoId;

    public function __construct(int $pedidoId, int $juegoId)
    {
        $this->setPedidoId($pedidoId);
        $this->setJuegoId($juegoId);
    }

    public function jsonSerialize()
    {
        return [
            "pedidoId" => $this->pedidoId,
            "juegoId" => $this->juegoId,
        ];
    }

    public function getJuegoId(){
        return $this->juegoId;
    }
    public function getPedidoId(){
        return $this->pedidoId;
    }
    public function setJuegoId($juegoId){
        $this->juegoId = $juegoId;
    }
    public function setPedidoId($pedidoId){
        $this->pedidoId = $pedidoId;
    }
    
}

class Pedido extends Carrito implements JsonSerializable {
    private $gameKey;
    private $usuarioId;
    private $fechaPedido;
    private $tiempoAlquiler;
    private $comprado;

    public function __construct(int $id, int $usuarioId, ?string $gameKey, ?string $fechaPedido, int $tiempoAlquiler, int $comprado)
    {

        $this->setId($id);
        $this->setGameKey($gameKey);
        $this->setFechaPedido($fechaPedido);
        $this->setTiempoAlquiler($tiempoAlquiler);
        $this->setComprado($comprado);
    }

    public function jsonSerialize()
    {
        return [
            "id" => $this->id,
            "usuarioId" => $this->usuarioId,
            "gameKey" => $this->gameKey,
            "fechaPedido" => $this->fechaPedido,
            "tiempoAlquiler" => $this->tiempoAlquiler,
            "comprado" => $this->comprado,
        ];
    }

    public function getGameKey()
    {
        return $this->gameKey;
    }

    public function setGameKey($gameKey)
    {
        $this->gameKey = $gameKey;
    }

    public function getFechaPedido()
    {
        return $this->fechaPedido;
    }

    public function setFechaPedido($fechaPedido)
    {
        $this->fechaPedido = $fechaPedido;
    }

    public function getTiempoAlquiler()
    {
        return $this->tiempoAlquiler;
    }

    public function setTiempoAlquiler($tiempoAlquiler)
    {
        $this->tiempoAlquiler = $tiempoAlquiler;
    }

    public function getComprado()
    {
        return $this->comprado;
    }

    public function setComprado($comprado)
    {
        $this->comprado = $comprado;
    }

}