if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session")
const flash = require("connect-flash")
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const passport = require("passport")

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
// app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));


// Passport config
require("./config/passport")(passport);

// Database config
const mongoose = require("mongoose");
const db = require("./config/keys").MongoURI
mongoose.set("strictQuery", true);

// Database Connection
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))


// BodyParser
app.use(express.urlencoded( {extended: false} ))

// Express Session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next()
} )




// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter)



app.listen(process.env.PORT || 3000);
