//jshint esversion:6
require("dotenv").config();
const express        = require("express"),
      bodyParser     = require("body-parser"),
      session        = require("express-session"),
       mysql          = require("mysql"),
       flash         = require("connect-flash"),
      methodOverride = require("method-override"),
      app            = express();



    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: process.env.SESS_NAME,
      cookie: { 
        secure: false, 
        maxAge: 3600000,
        sameSite: true,  
      }
    }))

    app.use(flash());
  app.use((req,res,next)=>{
    res.locals.loggedUser = req.session.user_name;
    res.locals.userStation = req.session.user_station;
    res.locals.userFlight = req.session.user_flightNumber;
    res.locals.error      = req.flash("error");
    res.locals.success    = req.flash("success");
    res.locals.loginerror    = req.flash("loginerror");
    next() 
  })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(methodOverride('_method'));


require("./routes")(app);

app.set("view engine", "ejs");





// Connection To Local Server 



app.listen(process.env.PORT || 3000, ()=>{
    console.log("Flight Ops Connected to local server 3000");
});





        //https://medium.com/@sesitamakloe/how-we-structure-our-express-js-routes-58933d02e491
