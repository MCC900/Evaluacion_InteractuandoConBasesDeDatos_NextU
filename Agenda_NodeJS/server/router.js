const router = require('express').Router();
const modelos = require("./modelos.js");
const ManagerIds = require("./managerids.js");

const Usuario = modelos.Usuario;
const Evento = modelos.Evento;

router.get("/crear", function(req, res){
  let usuarioNuevo = new Usuario({
    email:"mcc900@adinet.com.uy",
    contrasena:"12345",
    nombre:"J. Mariano Cis Carle",
    fechaNac:"23/10/1992"
  });

  usuarioNuevo.save(function(error){
    if(error){
      res.status(500);
      res.json(error);
    } else {
      res.send("Usuario "+usuarioNuevo.nombre+" añadido exitosamente a la base de datos.");
    }
  })
});

router.get("/events/all", function(req, res){
  if(!req.session.logueado){
    res.send("loginExpira");
    return;
  }

  Evento.find({usuario:req.session.usuario}).exec((error, resultado) => {
      if(error){
        res.status = 500;
        res.send("Error al intentar obtener eventos del usuario " + req.session.usuario + " de la base de datos.");
      } else {
        let eventos = [];
        for(let i = 0; i < resultado.length; i++){
          let evRes = resultado[i];
          let evento;
          if(evRes.fin){
            evento = {
              id:evRes.id,
              title:evRes.titulo,
              start:evRes.inicio,
              end:evRes.fin
            };
          } else {
            evento = {
              id:evRes.id,
              title:evRes.titulo,
              start:evRes.inicio
            };
          }
          eventos[eventos.length] = evento;
        }
        res.json(eventos);
      }
  });
});

router.post("/events/delete/:id", function(req, res){
  Evento.deleteOne({id:req.params.id}).exec(function(error){
    if(error){
      res.json(error);
    } else {
      res.send("Evento eliminado exitosamente. Id:"+req.params.id);
    }
  });
});

router.post("/events/new", function(req, res){
  if(!req.session.logueado){
    res.send("loginExpira");
    return;
  }

  ManagerIds.getIdNuevoEvento(function(idEvento){
    let eventoNuevo = new Evento({
      id:idEvento,
      usuario:req.session.usuario,
      titulo:req.body.title,
      inicio:req.body.start,
      fin:req.body.end //Aparentemente, si está vacío (caso de día completo)
                       // mongoose automáticamente lo toma como inexistente
    });

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

router.post("/login", function(req, res){

  let email = req.body.user;
  Usuario.findOne({email:email}).exec(function(error, usu){
    if(error){
      res.send("Error al realizar la consulta en la base de datos.");
    } else {
      if(usu.contrasena == req.body.pass){
        req.session.logueado = true;
        req.session.usuario = email;
        res.send("Validado");
      } else {
        res.send("Error: La contraseña para el usuario "+email+" es incorrecta.");
      }
    }
  });
});

module.exports = router;
