var express = require('express'); /* forma de importar en node */
var morgan =  require('morgan');
const path = require('path');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require("connect-flash")
const sesion  = require("express-session")
const passport = require("passport")

//initializations
var app = express();
require("./config/passport")  

//settings
app.set('port', process.env.PORT || 4000);
app.set('views' , path.join(__dirname , 'views')) // para hacerlo multiplataforma
app.engine('.hbs',handlebars({ //configuracion de motor
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
    })) 

app.set('view engine', '.hbs');

//middlewares
app.use(express.json()); //usar middleware para que express entienda formato json
app.use(express.urlencoded({extended: false}))
app.use(sesion({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash()); 
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
//sirve para ejecutar cualquier codigo antes de que las peticiones lleguen a su manejador
app.use(morgan('dev'));
app.use(methodOverride('_method'));

//global variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg") //devuelve el valor actual de succes_msg
    next();
}); 

//rutes
app.get('/', (req,res) => {
    res.render('index');
})

app.use(require('./routes/indexRoutes'));
app.use(require('./routes/Person'));
app.use(require('./routes/users'));
//static files 

app.use(express.static(path.join(__dirname,'public')));     

module.exports = app;