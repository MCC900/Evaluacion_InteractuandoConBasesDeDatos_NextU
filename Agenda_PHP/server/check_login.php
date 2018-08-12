<?php
  $email = $_POST["username"];
  $contrasena = $_POST["password"];

  //-----Archivos incluídos-----
  include('conexion.php');
  include('sesion.php');

  //-----Conectamos con la base de datos-----
  $conector = new ConectorBD(
    "localhost",
    "agenda_usuario_anonimo",
    "contrausuanon"
  );
  $conexion = $conector->initConexion("agenda_db");

  if($conexion == "OK"){
    //Conexión establecida

    //Buscamos el usuario en la base de datos
    $sql = "SELECT contrasena FROM usuarios WHERE email='".$email."';";
    $resQuery = $conector->ejecutarQuery($sql);

    if($resQuery){
      //Query ejecuta correctamente
      $fila = $resQuery->fetch_assoc();
      if($fila){
        //Existe usuario
        $hash = $fila["contrasena"];
        if(password_verify($contrasena, $hash)){
          //Contraseña correcta
          login($email); //INICIAMOS LA SESIÓN (ver sesion.php)
          $respuesta["msg"] = "OK"; //Login exitoso
        } else {
          //Contraseña incorrecta
          $respuesta["msg"] = "Contraseña incorrecta";
        }
      } else {
        //No existe usuario
        $respuesta["msg"] = "No se encontró al usuario ".$email." en la base de datos";
      };
    } else {
      //Query no ejecuta correctamente
      $respuesta["msg"] = "ERROR: La consulta SQL para el usuario '.$email.' no se realizó correctamente";
    }
  } else {
    //No se pudo conectar
    $respuesta["msg"] = "ERROR: El servidor no se pudo conectar a la base de datos";
  }
  $conector->cerrarConexion();
  echo json_encode($respuesta);
 ?>
