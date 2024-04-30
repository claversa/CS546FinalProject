//Here is where you'll set up your server as shown in lecture code
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use(session({
    secret: 'test', // Change this to a random string
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



/*app.use(async (req, res, next) => {
    if (req.path === '/') {
        if (req.session.user) { // logged in
            if (req.path === "/login") return res.redirect("/home"); // back to home page but logged in now, idk what the path would be lol
            next(); // ???
        }
        else {
            if (req.path !== "/login" && req.path !== "/createProfile") {
                return res.redirect('/login');// redirect to login route if not logged in
            }
            else {
                next();
            }
        }
    }
    else {
        next();
    }

});

app.use('/home', (req, res, next) => {
    if (req.session.user) { // logged in
        next(); // get to homepage
    }
    else {
        if (req.path !== "/login" && req.path !== "/createProfile") {
            return res.redirect('/login');// redirect to login route if not logged in and not already trying to get to login or createProfile
        }
        else {
            next();
        }
    }
});

app.use('/{race', (req, res, next) => {
    if (req.session.user) { // logged in
        next(); // get to homepage
    }
    else {
        if (req.path !== "/login" && req.path !== "/createProfile") {
            return res.redirect('/login');// redirect to login route if not logged in and not already trying to get to login or createProfile
        }
        else {
            next();
        }
    }
});


app.use('/login', (req, res, next) => {
    if (req.method === "GET") {
        if (req.session.user) { // logged in
            return res.redirect("/home");
        }
        else { // not logged in
            next(); // get through to the login
        }
    }
    else {
        next()
    }
}

);

app.use('/loginPage', (req, res, next) => {
    if (req.method === "GET") {
        if (req.session.user) { // logged in
            return res.redirect("/home");
        }
        else { // not logged in
            next(); // get through to the loginPage
        }
    }
    else {
        next()
    }
}

);


app.use('/createProfile', (req, res, next) => {
    if (req.method === "GET") {
        if (req.session.user) { // logged in
            return res.redirect('/home') // send to home
        }
        else { // not logged in
            next(); // get through to createProfile
        }
    }
    else {
        next()
    }
}

);

app.use('/profile', (req, res, next) => {
    if (req.method === "GET") {
        if (req.session.user) { // logged in
            next();// send to profile page
        }
        else { // not logged in
            return res.redirect("/login"); // go back to login
        }
    }
    else {
        next()
    }
}

);


app.use('/settings', (req, res, next) => {
    if (req.method === "GET") {
        if (req.session.user) { // logged in
            next(); // "fall through"
        }
        else { // not logged in
            return res.redirect('/login'); // redirect to login route
        }
    }
    else {
        next()
    }
}
);

app.use('/training', (req, res, next) => {
    if (req.method === "GET") {
        if (req.session.user) { // logged in
            next(); // "fall through"
        }
        else { // not logged in
            return res.redirect('/login'); // redirect to login route
        }
    }
    else {
        next()
    }
}
);

app.use('/countdown', (req, res, next) => {
    if (req.session.user) { // logged in
        next(); // "fall through"
    }
    else { // not logged in
        return res.redirect('/login'); // redirect to login route
    }
}
);





app.use('/logout', (req, res, next) => {
    if (req.method === "GET") {
        if (req.session.user) { // logged in
            next(); // fall through to next route
        }
        else { // not logged in
            return res.redirect('/login'); // redirect to login
        }
    }
    else {
        next()
    }
});
*/

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
