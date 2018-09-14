var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
  email:{type:String, required:true},
  contrasena:{type:String, required:true},
  nombre: {type:String, required:true},
  fechaNac: {type:String, required:true}
});

var eventoSchema = new Schema({
  id:{type:Number, require:true},
  usuario:{type:String, require:true},
  titulo:{type:String, required:true},
  inicio:{type:String, required:true},
  fin:{type:String, required:false}
});

var idSchema = new Schema({
  usuario:{type:String, require:true},
  ultimaId:{type:Number, require:true}
});

var Usuario = mongoose.model('Usuario', usuarioSchema);
var Evento = mongoose.model('Evento', eventoSchema);
var UltimaIdEvento = mongoose.model('UltimaIdEvento', idSchema);
module.exports = {Usuario:Usuario, Evento:Evento, UltimaIdEvento:UltimaIdEvento};
