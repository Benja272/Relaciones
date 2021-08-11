var express = require('express'); /* forma de importar en node */
var morgan =  require('morgan');
const path = require('path');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');


var app = express();

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
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
//sirve para ejecutar cualquier codigo antes de que las peticiones lleguen a su manejador
app.use(morgan('dev'));
app.use(methodOverride('_method'));

//rutes
app.get('/', (req,res) => {
    res.render('index');
})

app.use(require('./routes/indexRoutes'));
app.use(require('./routes/Person'));
//static files 

app.use(express.static(path.join(__dirname,'public')));     

module.exports = app;