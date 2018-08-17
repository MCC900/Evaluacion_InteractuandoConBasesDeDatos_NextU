<?php

  //-----Archivos incluídos-----
  include('conexion.php');
  include('sesion.php');


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

      //Obtenemos los eventos
      $sql = "SELECT titulo, fecha_inicio, hora_inicio,
        fecha_finalizacion, hora_finalizacion, dia_completo, fk_usuario
        FROM eventos WHERE fk_usuario='".$usuario."'";

      $resQuery = $conector->ejecutarQuery($sql);

      if($resQuery){
        //Query ejecuta correctamente

        while($fila = $resQuery->fetch_assoc()){
          //Creamos el objeto del evento

          $evento['title'] = $fila['titulo'];
          $evento['start'] = $fila['fecha_inicio'];


          if($fila['hora_inicio']){
            $evento['start'] .= "T".$fila['hora_inicio'];
          }

          if($fila['fecha_finalizacion']){
            $evento['end'] = $fila['fecha_finalizacion'];
            if($fila['hora_finalizacion']){
              $evento['end'] .= "T".$fila['hora_finalizacion'];
            }
          }
          
          $evento['allDay'] = $fila['dia_completo'] == 0 ? false : true;
          $respuesta["eventos"][] = $evento;
        }
        $respuesta['msg'] = "OK"; //Todo correcto

      } else {
        //Query no ejecuta correctamente
        $respuesta["msg"] = "ERROR: La consulta SQL para el usuario '.$email.' no se realizó correctamente";
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
