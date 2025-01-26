const express = require('express');
const path = require('path');
const {connect, getDb} = require('./config/db');

const app = express();

//Realizamos la conexion usando la funcion establecida en el archivo de configuracion
connect();

//Configuramos el motor de vistas EJS
app.set('view engine', 'ejs');
//Establecemos la carpeta views como la fuente de donde obtendremos las vistas
app.set('views', path.join(__dirname, "views"))

//Middleware para parsear body de peticiones http
app.use(express.urlencoded({extended:true}));

//Rutas
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

//Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, (req,res)=>{
    console.log('Server running in', PORT);
})
