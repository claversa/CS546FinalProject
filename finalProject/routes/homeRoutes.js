import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as races from '../data/races.js'; // need stuff from race db
import * as help from "../helpers/helpers.js"
import * as data from '../data/users.js';

router.route('/').get(async (req, res) => {
  //render the home handlebars file
  let loggedIn = false;
  if (req.session.user) {
    loggedIn = true;
  }
  res.render('home', { title: "Homepage", user: req.session.user, error: "", loggedIn: loggedIn, otherCSS: "/public/home.css" }); // NO ERROR
});

router.route('/error').get(async (req, res) => {
  const error = req.query.message || 'Error';
  res.status(403).render('error', { title: "Error", error, user: req.session.user, otherCSS: "/public/error.css" });
});

router.route('/createProfile')
  .get(async (req, res) => {
    //render the home handlebars file
    res.render('createProfile', { title: "Create Profile", user: req.session.user, error: "", otherCSS: "/public/createProfile.css" });
  })
  .post(async (req, res) => {
    //code here for POST this is where profile form will be submitting new user and then call your data function passing in the profile info   and then rendering the search results of up to 20 Movies.
    const profileInfo = req.body; // form info!
    let first = profileInfo.firstName;
    let last = profileInfo.lastName;
    let username = profileInfo.username;
    let email = profileInfo.email;
    let birthday = profileInfo.birthday;
    let state = profileInfo.state;
    let gender = profileInfo.gender;
    let system = profileInfo.system;
    let socialPlatform = profileInfo.social_platform;
    let socialHandle = profileInfo.social_handle;
    let password = profileInfo.password;
    // CHECK ALL THESE ^^^^^^^^^^^^^^66
    // -------------------- check
    // try {
    //   help.checkString(movieName, "movie name");
    // }
    // catch (e) {
    //   res.status(400).render('error', { title: "Error", class: "error", error: e.toString() });
    // }
    try {
      let newUser = await data.create(first,
        last,
        username,
        email,
        state,
        gender,
        birthday,
        socialPlatform,
        socialHandle,
        system,
        password); // create user
      console.log(newUser)
      // take user to homepage but now logged in
      res.redirect('./home');
    }
    catch (e) {
      res.render('createProfile', { title: "Create Profile", user: req.session.user, error: e, otherCSS: "/public/createProfile.css" });
      // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), otherCSS: "/public/error.css" });
    }
  });

router.route('/logout').get(async (req, res) => {
  delete req.session.user
  res.redirect('./home');
});

router.route('/login')
  .get(async (req, res) => {
    //render the home handlebars file
    res.render('login', { title: "Login", user: req.session.user, otherCSS: "/public/login.css" });
  })
  .post(async (req, res) => {
    const loginInfo = req.body; // form info!
    let username = loginInfo.username;
    let password = loginInfo.password;
    try {
      // HERE
      let validation = await data.check(username, password)
      if (validation) {
        req.session.user = { username: username };
        // take user to homepage but now logged in
        res.redirect('./home');
      } else {
        throw "Username or Password is incorrect"
      }
    }
    catch (e) {
      res.render('login', { title: "Login", user: req.session.user, error: e, otherCSS: "/public/login.css" });

      // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), otherCSS: "/public/error.css" });
    }
  });

router.route('/training').get(async (req, res) => {
  res.render("./training", { title: "Training Program", user: req.session.user });
});

router.route('/countdown').get(async (req, res) => {
  res.render("./countdown", { title: "Race Day Countdown", user: req.session.user });
});

//export router
export default router;