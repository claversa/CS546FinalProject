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
    res.render('home', { title: "Homepage", user: req.session.user, error: "", loggedIn: loggedIn }); // NO ERROR
});

router.route('/createProfile')
  .get(async (req, res) => {
    //render the home handlebars file
    res.render('createProfile', { title: "Create Profile", user: req.session.user });
  })
  .post(async (req, res) => {
    //code here for POST this is where profile form will be submitting new user and then call your data function passing in the profile info   and then rendering the search results of up to 20 Movies.
    const profileInfo = req.body; // form info!
    let first = profileInfo.firstName;
    let last = profileInfo.lastName;
    let username = profileInfo.username;
    let email = profileInfo.email;
    let birthday = profileInfo.birthday;
    let city = profileInfo.city;
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
        city,
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
      res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString() });
    }
  });

router.route('/logout').get(async (req, res) => {
    delete req.session.user
    res.redirect('./home');
});

router.route('/login')
  .get(async (req, res) => {
    //render the home handlebars file
    res.render('login', { title: "Login", user: req.session.user });
  })
  .post(async (req, res) => {
    const loginInfo = req.body; // form info!
    let username = loginInfo.username;
    let password = loginInfo.password;
    try {
      let validation = await data.check(username, password)
      if (validation) {
        console.log(validation.darkmode)
        req.session.user = { username: username, coloblind: validation.coloblind, darkmode: validation.darkmode };
        // take user to homepage but now logged in
        res.redirect('./home');
      } else {
        throw "Username or Password is incorrect"
      }
    }
    catch (e) {
      res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString() });
    }
});

router.route('/:raceId').get(async (req, res) => { // specific race
    //render race page
    let raceId = req.params.id;
    try {
        raceId = help.notStringOrEmpty(raceId);
    } catch (e) {
        // RACE DOESN"T EXIST?? ADD IT OR THROW ERROR?
        // ADDED ERROR ATTRIBUTE
        res.render("home", { title: "Homepage", user: req.session.user, error: "Race ID must be present" });
    }
    try {
        let raceData = await data.get(raceId);
        if (raceData.data.Response === "False") throw `${raceId} id not found`;
        res.render('racePage', { title: raceData.data.name, user: req.session.user, error: "", name: raceData.data.name, location: raceData.data.location, date: raceData.data.date, time: raceData.data.time, distance: raceData.data.distance, terrain: raceData.data.terrain, URL: raceData.data.URL, registrants: raceData.data.registrants });//? NO ERROR
    } catch (e) {
        // RACE DOESN"T EXIST?? ADD IT OR THROW ERROR?
        // ADDED ERROR ATTRIBUTE
        res.render("home", { title: "Homepage", user: req.session.user, error: "Race not found. Please add race." });
    }

});

//export router
export default router;