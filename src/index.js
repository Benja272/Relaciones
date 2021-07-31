const dotenv = require('dotenv');
dotenv.config()
const app = require('./server');
const db = require('./database')
app.listen(app.get('port'), () => {
    console.log("serve on port ", app.get('port'));
});