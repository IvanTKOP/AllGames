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

    public function __construct($id, $nombre, $apellidos, $email, $indentificador, $contrasenna, $codigoCookie, $administrador)
    {
        $this->id = ($id);
        $this->setNombre($nombre);
        $this->setApellidos($apellidos);
        $this->setEmail($email);
        $this->setIdentificador($indentificador);
        $this->setContrasenna($contrasenna);
        $this->setCodigoCookie($codigoCookie);
        $this->setAdministrador($administrador);
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
            "administrador" => $this->administrador,
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
    {return $this->Identificador;}
    public function getContrasenna()
    {return $this->contrasenna;}
    public function getCodigoCookie()
    {return $this->codigoCookie;}
    public function getAdministrador()
    {return $this->administrador;}

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
    public function setAdministrador($administrador)
    {$this->administrador = $administrador;}
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
