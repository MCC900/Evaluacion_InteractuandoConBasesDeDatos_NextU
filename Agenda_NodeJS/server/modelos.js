var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
  email:{type:String, required:true},
  contrasena:{type:String, required:true},
  nombre: {type:String, required:true},
  fechaNac: {type:String, required:true}
});

var Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
