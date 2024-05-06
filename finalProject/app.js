//Here is where you'll set up your server as shown in lecture code
import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
import Handlebars from './helpers/handlebarsHelpers.js';
import * as user from './data/users.js'


const app = express();

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

app.use(async (req, res, next) => {
    if (req.path !== '/login' && req.path !== '/createProfile' && req.path !== '/') {
        if (!req.session.user) {
            return res.redirect('/login');
        }
    }
    next();
});

app.use(async (req, res, next) => {
    if (req.path == '/login') {
        if (req.session.user) {
            return res.redirect(`/profile/${req.session.user.username}`);
        }
    }
    next();
});

app.use(async (req, res, next) => {
    if (req.path == '/createProfile') {
        if (req.session.user) {
            return res.redirect(`/profile/${req.session.user.username}`);
        }
    }
    next();
});

app.use(async (req, res, next) => {
    if (req.path.startsWith('/race/edit')) {
        if (req.session.user) {   
            try {
                const ok = await user.checkUser(req.session.user.username, req.path)
                if (!ok) {
                    return res.redirect('/error?message=Access Denied');
                }
            } catch {
                return res.redirect('/error?message=Cannot find race');
            }
        }
    }
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
