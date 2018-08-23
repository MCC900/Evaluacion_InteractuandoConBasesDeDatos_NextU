<?php
  //-----Archivos incluídos-----
  include('conexion.php');
  include('sesion.php');

  //-----Datos recibidos-----
  $id_evento = $_POST["id"];
  $fecha_inicio = $_POST["start_date"];
  $hora_inicio = isset($_POST["start_hour"]) ? $_POST["start_hour"] : "";
  $fecha_fin = isset($_POST["end_date"]) ? $_POST["end_date"] : "";
  $hora_fin = isset($_POST["end_hour"]) ? $_POST["end_hour"] : "";

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
      $sqlConsulta = "SELECT fk_usuario FROM eventos WHERE id=".$id_evento.";";
      $resConsulta = $conector->ejecutarQuery($sqlConsulta);
      if($resConsulta){
        //Query ejecuta correctamente
        $fila = $resConsulta->fetch_assoc();

        if($fila){
          //Evento encontrado
          if($fila["fk_usuario"] == $usuario){
            //Usuario coincide

            //Ahora creamos el sql para actualizar el evento dependiendo del tipo,
            //es decir, si se trata de un evento de día completo o no
            if($hora_inicio == ""){ //Si al menos hora_inicio está definido no se trata de un evento de día completo
              //dia_completo = TRUE
              $sqlUpdate = "UPDATE eventos SET fecha_inicio='".$fecha_inicio."' WHERE id=".$id_evento.";";
            } else {
              //dia_completo = FALSE
              $sqlUpdate = "UPDATE eventos SET ";
              $sqlUpdate .= "fecha_inicio='".$fecha_inicio."', ";
              $sqlUpdate .= "fecha_finalizacion='".$fecha_fin."', ";
              $sqlUpdate .= "hora_inicio='".$hora_inicio."', ";
              $sqlUpdate .= "hora_finalizacion='".$hora_fin."' ";
              $sqlUpdate .= "WHERE id=".$id_evento.";";
            }

            $resUpdate = $conector->ejecutarQuery($sqlUpdate);
            if($resUpdate){
              $respuesta["msg"] = "OK"; //Evento eliminado
            } else {
              //Error al intentar actualizar el evento
              $respuesta["msg"] = "ERROR: La query SQL para actualizar el evento no se ejecutó correctamente.";
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

  echo json_encode($respuesta);
 ?>
