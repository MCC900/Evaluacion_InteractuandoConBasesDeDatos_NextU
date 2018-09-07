var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
  email:{type:String, required:true},
  contrasena:{type:String, required:true},
  nombre: {type:String, required:true},
  fechaNac: {type:String, required:true}
});

var eventoSchema = new Schema({
  usuario:{type:String, require:true},
  titulo:{type:String, required:true},
  inicio:{type:String, required:true},
  fin:{type:String, required:false}
});

var Usuario = mongoose.model('Usuario', usuarioSchema);
var Evento = mongoose.model('Evento', eventoSchema);
module.exports = {Usuario:Usuario, Evento:Evento};
