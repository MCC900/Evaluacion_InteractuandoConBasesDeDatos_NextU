const router = require('express').Router();
const Usuario = require('./modelos.js');

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

module.exports = router;
