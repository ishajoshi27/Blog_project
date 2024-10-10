// express server which can be visited from the browser
require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const app = express();
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const { isActiveRoute } = require('./server/helpers/routeHelpers');
const connectDB = require('./server/config/db');
const session = require("express-session");

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'secretkey1234',
    resave: false,
    saveUninitialized: true,
    // store: new MongoStore ({mongooseConnection: mongoose.connection})
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),

}));
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// templating engine
app.use(expressLayout);
app.use(methodOverride('_method'));
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.locals.isActiveRoute = isActiveRoute;
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

const PORT = 5000 || process.env.PORT;






app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); }
)