var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//------USUARIO------
var usuarioSchema = new Schema({
  email:{type:String, required:true},
  contrasena:{type:String, required:true},
  nombre: {type:String, required:true}, //No utilizado por la aplicación
  fechaNac: {type:String, required:true} //No utilizado por la aplicación
});

//------EVENTO------
var eventoSchema = new Schema({
  id:{type:Number, require:true},
  usuario:{type:String, require:true},
  titulo:{type:String, required:true},
  inicio:{type:String, required:true},
  fin:{type:String, required:false}
});

//------ULTIMAIDEVENTO------
/*
  Este modelo registra la última id de evento utilizada para un usuario
  determinado. Se utiliza en managerids.js al pedir una nueva id
*/
var idSchema = new Schema({
  usuario:{type:String, require:true},
  ultimaId:{type:Number, require:true}
});

//Exportamos los modelos
var Usuario = mongoose.model('Usuario', usuarioSchema);
var Evento = mongoose.model('Evento', eventoSchema);
var UltimaIdEvento = mongoose.model('UltimaIdEvento', idSchema);
module.exports = {Usuario:Usuario, Evento:Evento, UltimaIdEvento:UltimaIdEvento};
