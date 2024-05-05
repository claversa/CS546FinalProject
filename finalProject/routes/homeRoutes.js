import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as racesFuns from '../data/races.js'; // need stuff from race db
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

router.route('/register/:raceId').post(async (req, res) => {
  try {
    const raceId = req.params.raceId;
    await racesFuns.registerUser(req.session.user.username, raceId)
    await data.registerRace(req.session.user.username, raceId)
    res.redirect(`/race/${raceId}`)
  } catch (error) {
    res.status(403).render('error', { title: "Error", error, user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/unregister/:raceId').post(async (req, res) => {
  try {
    const raceId = req.params.raceId;
    await racesFuns.unregisterUser(req.session.user.username, raceId)
    await data.unregisterRace(req.session.user.username, raceId)
    res.redirect(`/race/${raceId}`)
  } catch (error) {
    res.status(403).render('error', { title: "Error", error, user: req.session.user, otherCSS: "/public/error.css" });
  }
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
    }
  });

router.route('/training').get(async (req, res) => {
  res.render("./training", { title: "Training Program", otherCSS: "/public/training.css", plans: [[0, 1, 1, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 2.5], [0, 2, 2, 1, 0, 2, 3.1]] });
  // let username = req.params.id;
  // try {
  //   username = help.notStringOrEmpty(username, 'username'); // checks id, trims
  // }
  // catch (e) {
  //   res.status(404).render('error', { title: "Error", class: "error", error: "Not valid username", otherCSS: "/public/error.css" });
  // }
  // try {
  //   let user = await data.get(username)
  //   if (user) {
  //     res.render("./training", { title: "Training Program", plans: [[0, 1, 1, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 2.5], [0, 2, 2, 1, 0, 2, 3.1]], otherCSS: "/public/training.css" });
  //   }
  // }
  // catch (e) {
  //   res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), otherCSS: "/public/error.css" });
  // }
});

router.route('/countdown').get(async (req, res) => {
  let user = undefined;
  try {
    user = await data.get(req.session.user.username); // get user
  }
  catch (e) {
    return res.render("error", { title: "Error", user: req.session.user, error: e, otherCSS: "/public/error.css" })
  }
  // get races
  let races = user.registeredRaces;


  if (races.length === 0) {
    return res.render("countdown", { title: "Race Day Countdown", user: req.session.user, error: "", hasRaces: false, otherCSS: "/public/countdown.css" });

  }
  else {
    let race = undefined;
    let nextRace = undefined; // this will be the upcoming race given to countdown
    let farAway = undefined; // this will be how far until the upcoming race
    let date = undefined; // this will be race date given to countdown
    try {
      race = await racesFuns.get(races[0]);
      farAway = help.dateAway(race.raceDate);
      date = race.raceDate;
    }
    catch (e) {
      return res.render("error", { title: "Error", user: req.session.user, error: e, otherCSS: "/public/error.css" })
    }
    for (let raceId of races) {
      try {
        race = await racesFuns.get(raceId);
        let tempAway = help.dateAway(race.raceDate);
        if (tempAway < farAway) {
          farAway = tempAway; // amount of time, tracking purposes
          nextRace = race; // idk if even need, but this is the race
          date = race.raceDate; // give this date to countdown
        }
      }
      catch (e) {
        return res.render("error", { title: "Error", user: req.session.user, error: e, otherCSS: "/public/error.css" })

      }
    }
    return res.render("countdown", { title: "Race Day Countdown", user: req.session.user, error: "", hasRaces: true, raceDate: date, otherCSS: "/public/countdown.css" });
  }


});

//export router
export default router;