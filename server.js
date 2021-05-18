const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;


const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('Mi ultra hiper secreto'))

app.use(session({
    secret: 'mi ultra super secreto',
    resave: true,
    saveUninitialized: true
}));

/**CONFIGURACIÓN DE PASSPORT */
app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function (username, password, done) {
    if (username === "jizquierdo" && password === "1234") {
        return done(null, { id: 1, name: "Cody" });
    } else {
        done(null, false);
    }
}));

// {id:1, name:"Cody"} => serialización => 1

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


//Deserialización 1 => {id:1, name:"Cody"}

passport.deserializeUser(function (id, done) {
    done(null, { id: 1, name: "Cody" });
});




app.set('view engine', 'ejs');

app.get("/", (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}, (req, res) => {



    //si ya iniciamos sesion mostrar bienvenida
    res.send("Bienvenido");

    //si no iniciamos sesion redireccionamos a login
})


app.get("/login", (req, res) => {
    //Mostrar formulario de login
    res.render("login");
});


app.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login"
}))


app.get("/login", (req, res) => {
    //Recibir credenciales e iniciar sesion
    res.send("hola mundo");
});

app.listen(8080, () => console.log("server started"));