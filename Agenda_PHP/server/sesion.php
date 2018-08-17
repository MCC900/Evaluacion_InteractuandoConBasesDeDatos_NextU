<?php

  //-----Función de login de usuario-----
  function login($usuario){
    session_start();
    $_SESSION["usuarioLogueado"] = $usuario;
  }

  //-----Función de logout de usuario-----
  function logout(){
    session_close();
  }

  //-----Función que obtiene el usuario logueado actualmente-----
  function getUsuario(){
    session_start();
    return $_SESSION["usuarioLogueado"];
  }
 ?>
