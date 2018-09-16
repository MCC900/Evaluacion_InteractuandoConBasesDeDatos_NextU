const modelos = require("./modelos.js");
const UltimaIdEvento = modelos.UltimaIdEvento;

/*
  Esta función recibe el email del usuario y devuelve la última id de evento utilizada
  por el mismo, luego llama al callback. Si se da un error envía la id -1
*/
function getIdNuevoEvento(usuario, callback){
  UltimaIdEvento.findOne({usuario:usuario}).exec(function(error, resultado){
    if(error){
      //Error al ejecutar la consulta
      callback(-1);
    } else {
      let idNuevoEvento;
      if(resultado == null){
        //No existe un registro de última id para el usuario en cuesión, así
        //que creamos uno nuevo inicializado en 0
        let regIdEvento = new UltimaIdEvento({
          usuario:usuario,
          ultimaId:0
        });

        regIdEvento.save(function(error){
          if(error){
            //Error al intentar guardar el registro
            callback(-1);
          } else {
            //Registro de id de evento creado, inicializado en 0
            callback(0);
          }
        });
      } else {
        //Sumamos 1 a la última id de evento utilizada
        let nuevaId = resultado.ultimaId + 1;

        //Actualizamos el registro
        UltimaIdEvento.updateOne({usuario:usuario}, {ultimaId:nuevaId}, function(error, resActualizado){
          if(error){
            //Error al intentar actualizar el registro
            callback(-1);
          } else {
            //Todo correcto. Devolvemos la nueva id
            callback(nuevaId);
          }
        });
      }
    }
  });
}

//Exportamos la función getIdNuevoEvento
module.exports = { getIdNuevoEvento:getIdNuevoEvento };
