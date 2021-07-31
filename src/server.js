var express = require('express'); /* forma de importar en node */
var morgan =  require('morgan');
const path = require('path');
var app = express();

//settings
app.set('port', process.env.PORT || 4000);
app.set('views' , path.join(__dirname , 'views')) // para hacerlo multiplataforma

//middlewares
app.use(express.json()); //usar middleware para que express entienda formato json
app.use(express.urlencoded({extended: false}))
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
//sirve para ejecutar cualquier codigo antes de que las peticiones lleguen a su manejador
app.use(morgan('dev'));

//rutes
app.all('/user',(req,res,next) => {
    console.log("paso");
    next();
});

app.get('/w', (req,res) => {
    res.send("Hola perro");
});

//rutas dinamicas el valor queda guardado en id
app.get('/aa', (req,res) => {
    console.log(req.params);
    res.send("Hola perro");
});

app.post('/w', (req,res) => {
    console.log(req.body); //muestra contenido de request
    res.send("pst");
});

app.get('/about', (req,res) => {
    res.json({
        name: "vayo" // objeto de js
    });
});

//static files 

app.use(express.static(path.join(__dirname,'public')));     

module.exports = app;