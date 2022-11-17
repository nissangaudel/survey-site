// require packages import
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');

const routes = require('./server/routes/router');
const connectDB = require('./server/db/connection');

//initialize express app
const app = express();

//points to the config file 
dotenv.config({ path: 'config.env' });

const PORT = process.env.PORT || 8080

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

//define the view engine
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'node_modules')));


//routes
app.use('/', routes);


app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
})

