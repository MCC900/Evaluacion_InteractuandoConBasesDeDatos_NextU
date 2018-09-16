const router = require('express').Router();
const modelos = require("./modelos.js");
const ManagerIds = require("./managerids.js");

const Usuario = modelos.Usuario;
const Evento = modelos.Evento;

//------Creación de usuario------
router.post("/crear", function(req, res){
  let usuarioNuevo = new Usuario({
    email:req.body.email,
    contrasena:req.body.contrasena,
    nombre:req.body.nombre,
    fechaNac:req.body.fechaNac
  });

  usuarioNuevo.save(function(error){
    if(error){
      res.status(500);
      res.json({error:error, msg:"Error al crear el usuario. Detalles impresos en consola."});
    } else {
      res.send("Usuario '"+usuarioNuevo.nombre+"' añadido exitosamente a la base de datos.");
    }
  })
});

//-----Lecura de todos los eventos existentes-----
router.get("/events/all", function(req, res){
  //Verificamos si hay una sesión de express-session abierta
  if(!req.session.logueado){
    res.send("loginExpira");
    return;
  }

  //-----Buscamos los eventos pertenecientes al usuario en sesión-----
  Evento.find({usuario:req.session.usuario}).exec((error, resultado) => {
      if(error){
        //ERROR
        res.status = 500;
        res.send("Error al intentar obtener eventos del usuario " + req.session.usuario + " de la base de datos.");
      } else {
        //Eventos obtenidos exitosamente

        //Ahora convertimos los eventos obtenidos de la base de  datos en 'resultado' al
        //formato en el que fullcalendar los utilizará para enviarlos ya hechos
        let eventos = [];

        for(let i = 0; i < resultado.length; i++){
          let evRes = resultado[i];
          let evento;
          if(evRes.fin){
            //Evento NO es de día completo
            evento = {
              id:evRes.id,
              title:evRes.titulo,
              start:evRes.inicio,
              end:evRes.fin
            };
          } else {
            //Evento es de día completo
            evento = {
              id:evRes.id,
              title:evRes.titulo,
              start:evRes.inicio
            };
          }
          eventos[eventos.length] = evento;
        }

        //Enviamos los eventos
        res.json(eventos);
      }
  });
});

//-----Borrar un evento-----
router.post("/events/delete/:id", function(req, res){

  //Verificamos si hay una sesión de express-session abierta
  if(!req.session.logueado){
    res.send("loginExpira");
    return;
  }

  //Borramos el evento del usuario en sesión con la id indicada
  Evento.deleteOne({usuario:req.session.usuario, id:req.params.id}).exec(function(error){
    if(error){
      res.json(error);
    } else {
      res.send("Evento eliminado exitosamente. Id:"+req.params.id);
    }
  });
});

//-----Creación de evento-----
router.post("/events/new", function(req, res){

  //Verificamos si hay una sesión de express-session abierta
  if(!req.session.logueado){
    res.send("loginExpira");
    return;
  }

  //Pedimos una nueva id de evento a managerids.js, que es devuelta como
  //el parámetro idEvento en el callback al terminar la solicitud
  ManagerIds.getIdNuevoEvento(req.session.usuario, function(idEvento){

    //Verificamos que getIdNuevoEvento se haya ejecutado sin errore
    if(idEvento == -1){
      res.send("Error al buscar la última id de evento en la base de datos.");
      return;
    }
    
    //Creamos el evento
    let eventoNuevo = new Evento({
      id:idEvento,
      usuario:req.session.usuario,
      titulo:req.body.title,
      inicio:req.body.start,
      fin:req.body.end //Aparentemente, si está vacío (caso de día completo)
                       // mongoose automáticamente lo toma como inexistente
    });

    //Lo guardamos
    eventoNuevo.save(function(error){
      if(error){
        res.status(500);
        res.json(error);
      } else {
        res.json({
          msg:"Evento "+eventoNuevo.titulo+" añadido exitosamente a la base de datos.",
          idEvento:idEvento
        });
      }
    });
  });
});

//-----Actualizar un evento-----
router.post("/events/update", function(req, res){

  //Verificamos si hay una sesión de express-session abierta
  if(!req.session.logueado){
    res.send("loginExpira");
    return;
  }

  //Creamos un objeto con las propiedades a cambiar (la id no se incluye porque se mantiene)
  let eventoActualizado = {
    usuario:req.session.usuario,
    titulo:req.body.title,
    inicio:req.body.start,
    fin:req.body.end
  };

  //Actualizamos el evento
  Evento.updateOne({id:req.body.id}, eventoActualizado, function(error, evento){
    if(error){
      res.status(500);
      res.json(error);
    } else {
      res.json({
        msg:"Evento "+eventoActualizado.titulo+" modificado exitosamente.",
        idEvento:req.body.id
      });
    }
  });
});

//-----Login de usuario-----
router.post("/login", function(req, res){
  let email = req.body.user;

  //Buscamos el usuario en la base de datos
  Usuario.findOne({email:email}).exec(function(error, usu){
    if(error){
      //Error en la consulta
      res.send("Error al realizar la consulta en la base de datos.");
    } else {
      //Consulta realizada exitosamente
      if(usu){
        //Usuario existe
        if(usu.contrasena == req.body.pass){
          //Contraseña correcta

          //Guardamos el usuario en una sesión de express-session y lo damos por logueado
          req.session.logueado = true;
          req.session.usuario = email;
          res.send("Validado");
        } else {
          //Contraseña incorrecta
          res.send("Error: La contraseña para el usuario "+email+" es incorrecta.");
        }
      } else {
        //Usuario NO existe
          res.send("Error: Usuario no encontrado en la base de datos.");
      }
    }
  });
});

//Exportamos el router
module.exports = router;
