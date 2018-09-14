const modelos = require("./modelos.js");
const UltimaIdEvento = modelos.UltimaIdEvento;

function getIdNuevoEvento(usuario, callback){
  UltimaIdEvento.findOne({usuario:usuario}).exec(function(error, resultado){
    if(error){
      callback(-1);
    } else {
      let idNuevoEvento;
      if(resultado == null){
        let regIdEvento = new UltimaIdEvento({
          usuario:usuario,
          ultimaId:0
        });
        regIdEvento.save(function(error){
          if(error){
            callback(-1);
          } else {
            callback(0);
          }
        });
      } else {
        let nuevaId = resultado.ultimaId + 1;
        UltimaIdEvento.updateOne({usuario:usuario}, {ultimaId:nuevaId}, function(error, resActualizado){
          if(error){
            callback(-1);
          } else {
            callback(nuevaId);
          }
        });
      }
    }
  });
}

module.exports = { getIdNuevoEvento:getIdNuevoEvento };
