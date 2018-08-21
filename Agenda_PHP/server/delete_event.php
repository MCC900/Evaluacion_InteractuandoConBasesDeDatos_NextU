<?php
  //-----Archivos incluídos-----
  include('conexion.php');
  include('sesion.php');

    //-----Datos recibidos-----
  $idevento = $_POST["id"];

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

      //Antes de hacer nada, nos aseguramos de que el evento
      //a eliminar pertenezca al usuario logueado
      $sqlConsulta = "SELECT fk_usuario FROM eventos WHERE id=".$idevento.";";
      $resConsulta = $conector->ejecutarQuery($sqlConsulta);
      if($resConsulta){
        //Query ejecuta correctamente
        $fila = $resConsulta->fetch_assoc();
        if($fila){
          //Evento encontrado
          if($fila["fk_usuario"] == $usuario){
            //Usuario coincide
            //Creamos el sql para eliminar el evento y lo ejecutamos
            $sqlDelete = "DELETE FROM eventos WHERE id=".$idevento.";";
            $resDelete = $conector->ejecutarQuery($sqlDelete);
            if($resDelete){
              $respuesta["msg"] = "OK"; //Evento eliminado
            } else {
              //Error al intentar eliminar el evento
              $respuesta["msg"] = "ERROR: La query SQL para eliminar el evento no se ejecutó correctamente.";
            }
          } else {
            //Usuario no coincidente
            $respuesta["msg"] = "El evento que se intenta eliminar no pertenece al usuario solicitante.";
          }
        } else {
          //Evento no encontrado
          $respuesta["msg"] = "No se encontró el evento con la id especificada.";
        }
      } else {
        //Query no ejecuta correctamente
        $respuesta["msg"] = "ERROR: La consulta SQL no se ejecutó correctamente.";
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
