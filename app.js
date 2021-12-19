const express = require('express');
const session = require('express-session');
const hbs = require('hbs');
const errorMiddleware = require("./middlewares/error");
const app = express();


app.use(session({
    secret: 'Hello World',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

app.use('/', express.static(__dirname + '/public'));

//Setting routes
app.use('/', require('./routes/homeRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

//Handling errors
app.use(errorMiddleware);

const port = 4444;
app.listen(port, err => {
    if (err) console.log(`Server failed to start. Error: ${err.message}`)
    else console.log(`Server started on port http://localhost:${port}`)
});