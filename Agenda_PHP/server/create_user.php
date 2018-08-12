<?php
  //-----Archivo incluído-----
  include('conexion.php');

  //-----Conectamos con la base de datos-----
  $conector = new ConectorBD(
    "localhost",
    "agenda_usuario_anonimo",
    "contrausuanon"
  );
  echo "Conectando... " . $conector->initConexion("agenda_db")."<br>";

  //-----Creamos 3 usuarios manualmente usando la función descrita abajo-----
  crearUsuario("'mcc900@adinet.com.uy'", "'Julio Mariano Cis Carle'", "12345", "'1992-10-23'", $conector);
  crearUsuario("'juandez@gmail.com'", "'Juan Hernández Casas'", "98765", "'1973-05-13'", $conector);
  crearUsuario("'pedro123@gmail.com'", "'Pedro Vedel'", "passpv", "'1995-12-01'", $conector);
  $conector->cerrarConexion();

  //-----FUNCIÓN: Crea un usuario en la base de datos-----
  function crearUsuario($email, $nombre, $contrasena, $fechaNacimiento, $conector){
    $contrasenaEncriptada = "'".password_hash($contrasena, PASSWORD_DEFAULT)."'";

    $sql = "INSERT INTO usuarios (email, nombre, contrasena, fecha_nacimiento) ";
    $sql .= "VALUES (".$email.", ".$nombre.", ".$contrasenaEncriptada.", ".$fechaNacimiento.");";

    $respuesta = $conector->ejecutarQuery($sql);
    if($respuesta){
      echo "<br> Usuario ".$nombre." insertado exitosamente.";
    } else {
      echo "<br> Error al insertar el usuario ".$nombre."...<br>";
      echo mysqli_error($conector->conexion)."<br>";
    };
  }



 ?>
