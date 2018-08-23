<?php
  //-----Archivos incluídos-----
  include('conexion.php');
  include('sesion.php');

  //-----Datos recibidos-----

  $titulo = $_POST["titulo"];
  $fecha_inicio = $_POST["start_date"];
  $dia_completo = $_POST["allDay"];
  $hora_inicio = $_POST["start_hour"];
  $fecha_fin = $_POST["end_date"];
  $hora_fin = $_POST["end_hour"];

  $usuario = getUsuario(); //ver sesion.php
  if($usuario){
    //Encontrado usuario logueado
    //-----Conectamos con la base de datos-----
    $conector = new ConectorBD(
      "localhost",
      "agenda_usuario_logueado",
      "usulog214365"
    );

    $conexion = $conector->initConexion("agenda_db");

    if($conexion == "OK"){
      //Conexión establecida

      //Creamos el SQL
      if($dia_completo === "false"){
        $sql = "INSERT into eventos(titulo, fecha_inicio, hora_inicio,".
          "fecha_finalizacion, hora_finalizacion, dia_completo, fk_usuario)".
          " VALUES('".$titulo."','".$fecha_inicio."','".$hora_inicio."','".$fecha_fin."','".
          $hora_fin."',FALSE,'".$usuario."');";
      } else {
        $sql = "INSERT into eventos(titulo, fecha_inicio, dia_completo, fk_usuario)".
        " VALUES('".$titulo."','".$fecha_inicio."',TRUE,'".$usuario."');";
      }

      //Ejecutamos la query
      $resQuery = $conector->ejecutarQuery($sql);

      if($resQuery){
          $respuesta["msg"] = "OK"; //Evento insertado
          //Ahora obtendremos la id del evento asignada automáticamente por la base de datos (ver doc. de MySQLi)
          $respuesta["idEvento"] = $conector->conexion->insert_id;
          //$respuesta["idEvento"] =
      } else {
          //Query no ejecuta correctamente
          $respuesta["msg"] = "ERROR: La query SQL para insertar el nuevo evento '".$titulo."' no se realizó correctamente";

      }
    } else {
      //No se pudo conectar
      $respuesta["msg"] = "ERROR: El servidor no se pudo conectar a la base de datos";
    }
  } else {
    //No hay un usuario logueado actualmente
    $respuesta["msg"] = "ERROR: No hay una sesión abierta";
  }

  $conector->cerrarConexion();
  echo json_encode($respuesta);
 ?>
