<?php

  class ConectorBD
  {
    private $host;
    private $usuario;
    private $contrasena;
    public $conexion;

    function __construct($host, $usuario, $contrasena){
      $this->host = $host;
      $this->usuario = $usuario;
      $this->contrasena = $contrasena;
    }

    function initConexion($nombre_bd){
      $this->conexion = new mysqli($this->host, $this->usuario, $this->contrasena, $nombre_bd);
      if ($this->conexion->connect_error) {
        return $this->conexion;
      }else {
        mysqli_set_charset($this->conexion, "utf8");
        return "OK";
      }
    }

    function ejecutarQuery($query){
      return $this->conexion->query($query);
    }

    function cerrarConexion(){
      return $this->conexion->close();
    }
  }

 ?>
