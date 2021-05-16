const express = require('express')
const dotenv = require('dotenv')
// const connectDB = require('./config/db')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)

// Load config
dotenv.config({ path: './config/config.env'})

// Passport config
require ('./config/passport')(passport)
// connectDB() 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true,
    useFindAndModify: false }, () => console.log("MongoDB Connected"))

const app = express()

// Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json()) 

// Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon } = require('./helpers/hbs')

// Handlebars
app.engine('hbs', exphbs({ helpers: {
    formatDate, 
    stripTags, 
    truncate,
    editIcon,
}, defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

// Static Folders
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/notes', require('./routes/notes'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
)