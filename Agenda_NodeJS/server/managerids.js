const modelos = require("./modelos.js");
const RegistroId = modelos.RegistroId;

function getIdNuevoEvento(callback){
  RegistroId.findOne({nombreElemento:"Evento"}).exec(function(error, resultado){
    if(error){
      callback(-1);
    } else {
      let idNuevoEvento;
      if(resultado == null){
        regIdEvento = new RegistroId({
          nombreElemento:"Evento",
          ultimaId:0
        });
        regIdEvento.save();
        idNuevoEvento = 0;
      } else {
        idNuevoEvento = resultado.ultimaId + 1;
      }
      callback(idNuevoEvento);
    }
  });
}

module.exports = { getIdNuevoEvento:getIdNuevoEvento };
