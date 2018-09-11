const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const router = require('./router.js');
const app = express();
const puerto = 3000;

let rutaCliente = path.join(__dirname, "../")+"client/";
app.use(express.static(rutaCliente));
app.use(express.static(rutaCliente+"img/"));
app.use(express.static(rutaCliente+"css/"));
app.use(express.static(rutaCliente+"js/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({secret: 's5YM9_2lsu12k9T=Llx', cookie:{maxAge:900000}})); //Sesiones abiertas por 15 minutos máx.
app.use("", router);

const servidor = http.createServer(app);

servidor.listen(puerto, function(){
  console.log("Servidor corriendo en el puerto "+puerto);
});

let url = "mongodb://localhost/agenda_db";
mongoose.connect(url);
