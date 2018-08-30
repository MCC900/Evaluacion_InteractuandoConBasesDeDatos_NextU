const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./router.js');
const app = express();
const puerto = 8182;

let rutaCliente = path.join(__dirname, "../")+"client/";
app.use(express.static(rutaCliente));
app.use("/usuarios", router);

const servidor = http.createServer(app);

servidor.listen(puerto, function(){
  console.log("Servidor corriendo en el puerto "+puerto);
});

let url = "mongodb://localhost/agenda_db";
mongoose.connect(url);
