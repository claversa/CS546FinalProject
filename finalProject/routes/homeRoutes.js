import { Router } from "express";
const router = Router();
// Data file for the data functions
import * as racesFuns from '../data/races.js'; // need stuff from race db
import * as help from "../helpers/helpers.js"
import * as data from '../data/users.js';
import { ObjectId } from "mongodb";
import xss from 'xss';

router.route("/").get(async (req, res) => {
  //render the home handlebars file
  let loggedIn = false;
  if (req.session.user) {
    loggedIn = true;
  }
  res.render("home", {
    title: "Homepage",
    user: req.session.user,
    error: "",
    loggedIn: loggedIn,
    otherCSS: "/public/home.css",
  }); // NO ERROR
});

router.route('/editProfile/:id').get(async (req, res) => {
  const username = xss(req.params.id);
  try {
    const user = await data.get(username);
    res.render('editProfile', { privacy: user.private, otherCSS: "/public/editProfile.css", username, title: "Edit Profile", user: req.session.user, error: "", gender: user.gender.toUpperCase(), system: user.system.toUpperCase(), state: user.state.toUpperCase(), socialHandle: user.socialHandle, socialPlatform: user.socialPlatform.toUpperCase(), private: user.private, user: req.session.user,  });
  } catch{ 

  }
  });

router.route('/comment/:raceId').post(async (req, res) => {
  try {
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    let comment = xss(req.body.comment);
    comment = help.notStringOrEmpty(comment);
    await racesFuns.addComment(req.session.user.username, raceId, comment)
    res.redirect(`/race/${raceId}`)
  } catch (error) {
    res.status(403).render("error", {
      title: "Error",
      error,
      user: req.session.user,
      otherCSS: "/public/error.css",
    });
  }
});

router.route("/uncomment/:raceId").post(async (req, res) => {
  try {
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    let comment = xss(req.body.comment);
    comment = help.notStringOrEmpty(comment);
    await racesFuns.removeComment(req.session.user.username, raceId, comment)
    res.redirect(`/race/${raceId}`)
  } catch (error) {
    res.status(403).render("error", {
      title: "Error",
      error,
      user: req.session.user,
      otherCSS: "/public/error.css",
    });
  }
});

router.route("/review/:raceId").post(async (req, res) => {
  try {
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    let comment = xss(req.body.review);
    comment = help.notStringOrEmpty(comment);
    let rating = xss(req.body.rating);
    let validRating = ["1", "2", "3", "4", "5"];
    if (!validRating.includes(rating)) throw "Error: invalid rating";
    await racesFuns.addReview(req.session.user.username, raceId, comment, rating)
    await data.addReview(req.session.user.username, raceId, comment, rating)
    res.redirect(`/race/${raceId}`)
  } catch (error) {
    res.status(403).render("error", {
      title: "Error",
      error,
      user: req.session.user,
      otherCSS: "/public/error.css",
    });
  }
});

router.route("/removeReview/:raceId").post(async (req, res) => {
  try {
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    let comment = xss(req.body.review);
    comment = help.notStringOrEmpty(comment);
    let rating = xss(req.body.rating);
    let validRating = ["1", "2", "3", "4", "5"];
    if (!validRating.includes(rating)) throw "Error: invalid rating";
    await racesFuns.removeReview(req.session.user.username, raceId, comment, rating)
    await data.removeReview(req.session.user.username, raceId, comment, rating)
    res.redirect(`/race/${raceId}`)
  } catch (error) {
    res.status(403).render("error", {
      title: "Error",
      error,
      user: req.session.user,
      otherCSS: "/public/error.css",
    });
  }
});

router.route("/register/:raceId").post(async (req, res) => {
  try {
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await racesFuns.registerUser(req.session.user.username, raceId);
    await data.registerRace(req.session.user.username, raceId);
    await data.addTrainingPlan(
      req.session.user.username,
      raceId,
      req.body.maxMileageYet
    );
    res.redirect(`/race/${raceId}`);
  } catch (error) {
    res.status(403).render("error", {
      title: "Error",
      error,
      user: req.session.user,
      otherCSS: "/public/error.css",
    });
  }
});

router.route("/unregister/:raceId").post(async (req, res) => {
  try {
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await racesFuns.unregisterUser(req.session.user.username, raceId);
    await data.unregisterRace(req.session.user.username, raceId);
    await data.removeTrainingPlan(req.session.user.username, raceId);
    res.redirect(`/race/${raceId}`);
  } catch (error) {
    res.status(403).render("error", {
      title: "Error",
      error,
      user: req.session.user,
      otherCSS: "/public/error.css",
    });
  }
});

router.route('/error').get(async (req, res) => {
  const error = xss(req.query.message) || 'Error';
  res.status(403).render('error', { title: "Error", error, user: req.session.user, otherCSS: "/public/error.css" });
});

router
  .route("/createProfile")
  .get(async (req, res) => {
    //render the home handlebars file
    res.render("createProfile", {
      title: "Create Profile",
      user: req.session.user,
      error: "",
      otherCSS: "/public/createProfile.css",
    });
  })
  .post(async (req, res) => {
    //code here for POST this is where profile form will be submitting new user and then call your data function passing in the profile info   and then rendering the search results of up to 20 Movies.
    const profileInfo = req.body; // form info!
    let first = xss(profileInfo.firstName);
    let last = xss(profileInfo.lastName);
    let username = xss(profileInfo.username);
    let email = xss(profileInfo.email);
    let birthdate = xss(profileInfo.birthday);
    let state = xss(profileInfo.state);
    let gender = xss(profileInfo.gender);
    let system = xss(profileInfo.system);
    let socialPlatform = xss(profileInfo.social_platform);
    let socialHandle = xss(profileInfo.social_handle);
    let password = xss(profileInfo.password);

    const errors = [];
    try {
      first = help.notStringOrEmpty(first, "firstName");
    } catch (e) {
      errors.push(`invalid firstName`);
    }

    try {
      last = help.notStringOrEmpty(last, "lastName");
    } catch (e) {
      errors.push(`invalid lastName`);
    }

    try {
      username = help.notStringOrEmpty(username, "username");
      username = help.validUsername(username);
    } catch (e) {
      errors.push(`invalid username: username must have between 2 and 10 characters`);
    }

    try {
      email = help.notStringOrEmpty(email, "email");
      email = help.validEmail(email);
    } catch (e) {
      errors.push(`invalid email`);
    }

    try {
      state = help.notStringOrEmpty(state, "state");
      state = help.validState(state);
    } catch (e) {
      errors.push(`invalid state`);
    }

    try {
      gender = help.notStringOrEmpty(gender, "gender");
      if (gender !== "male" && gender !== "female" && gender !== "other" && gender !== "preferNot") {
        errors.push('invalid gender response');
      }
    } catch (e) {
      errors.push(`invalid gender`);
    }

    try {
      socialPlatform = help.notStringOrEmpty(socialPlatform, "social platform");
      const validPlatforms = ["twitter", "facebook", "instagram"];
      if (!validPlatforms.includes(socialPlatform)) {
        errors.push('invalid social platform');
      }
    } catch (e) {
      errors.push(`invalid social platform`);
    }

    try {
      socialHandle = help.notStringOrEmpty(socialHandle, "social handle");
    } catch (e) {
      errors.push(`invalid social handle`);
    }

    try {
      system = help.notStringOrEmpty(system, "system");
      if (system !== "metric" && system !== "imperial") {
        errors.push('invalid measurement system');
      }
    } catch (e) {
      errors.push(`invalid system`);
    }

    try {
      password = help.notStringOrEmpty(password, "password");
      password = help.validPassword(password);
    } catch (e) {
      errors.push(`invalid password: password must have at least 8 characters with at least 1 uppercase letter, number, and special character`);
    }

    let age;
    try {
      birthdate = help.notStringOrEmpty(birthdate, "birthdate");
      help.validBirthdate(birthdate);
      age = help.calculateAge(birthdate);
      if (age < 13) {
        errors.push("Age must be above 13 to register");
      }
    } catch (e) {
      errors.push(`invalid birthdate`);
    }


    if (errors.length > 0) {
      // console.log('Errors found:', errors);
      return res.render('createProfile', { title: "Create Profile", user: req.session.user, error: errors, otherCSS: "/public/createProfile.css" });
    }

    try {
      let newUser = await data.create(
        first,
        last,
        username,
        email,
        state,
        gender,
        birthdate,
        socialPlatform,
        socialHandle,
        system,
        password
      ); // create user
      console.log(newUser);
      // take user to homepage but now logged in
      res.redirect("./home");
    } catch (e) {
      res.render("createProfile", {
        title: "Create Profile",
        user: req.session.user,
        error: e,
        otherCSS: "/public/createProfile.css",
      });
    }
  });

router.route("/logout").get(async (req, res) => {
  delete req.session.user;
  res.redirect("./home");
});

router
  .route("/login")
  .get(async (req, res) => {
    //render the home handlebars file
    res.render("login", {
      title: "Login",
      user: req.session.user,
      otherCSS: "/public/login.css",
    });
  })
  .post(async (req, res) => {
    const loginInfo = req.body; // form info!
    let username = xss(loginInfo.username);
    let password = xss(loginInfo.password);
    let errors = [];
    try {
      username = help.notStringOrEmpty(username, "username");
      username = username.toLowerCase();
    } catch (e) {
      errors.push(`username or password is incorrect`);
    }
    try {
      password = help.notStringOrEmpty(password, "password");
    } catch (e) {
      errors.push(`username or password is incorrect`);
    }
    try {
      let validation = await data.check(username, password)
      if (validation) {
        req.session.user = { username: username };
        // take user to homepage but now logged in
        res.redirect("./home");
      } else {
        throw "Username or Password is incorrect";
      }
    } catch (e) {
      res.render("login", {
        title: "Login",
        user: req.session.user,
        error: e,
        otherCSS: "/public/login.css",
      });
    }
  });

router.route("/training").get(async (req, res) => {
  let user = undefined;
  try {
    user = await data.get(req.session.user.username);
  } catch (e) {
    res.render("error", {
      title: "Error",
      user: req.session.user,
      error: e,
      otherCSS: "/public/error.css",
    });
  }
  res.render("./training", {
    title: "Training Program",
    otherCSS: "/public/training.css",
    user: req.session.user,
    plans: user.currPlan,
    othArr: JSON.stringify(user.currPlan)
  });
});

router.route("/training").post(async (req, res) => {
  let user = undefined;
  try {
    user = await data.get(req.session.user.username);
  } catch (e) {
    res.render("error", {
      title: "Error",
      user: req.session.user,
      error: e,
      otherCSS: "/public/error.css",
    });
  }
  
  user = await data.updateTrainingTimes(
    req.session.user.username,
    req.body.times
  );
  res.render("./training", {
    title: "Training Program",
    otherCSS: "/public/training.css",
    user: req.session.user,
    plans: user.currPlan,
    othArr: JSON.stringify(user.currPlan)
  });
});

router.route("/countdown").get(async (req, res) => {
  let user = undefined;
  try {
    user = await data.get(req.session.user.username); // get user
  } catch (e) {
    return res.render("error", {
      title: "Error",
      user: req.session.user,
      error: e,
      otherCSS: "/public/error.css",
    });
  }
  // get races
  let races = user.registeredRaces;

  if (races.length === 0) {
    return res.render("countdown", {
      title: "Race Day Countdown",
      user: req.session.user,
      error: "",
      hasRaces: false,
      otherCSS: "/public/countdown.css",
    });
  } else {
    let farAway = Infinity;
    let race, date, time;
    let countdownDates = [];

    // Iterate over the races
    for (let raceId of races) {
      try {
        race = await racesFuns.get(raceId);
        let date = race.raceDate;
        let time = race.raceTime;
        let countdownDate = new Date(`${date} ${time}`)
        countdownDates.push(countdownDate)
      }
      catch (e) {
        return res.render("error", { title: "Error", user: req.session.user, error: e, otherCSS: "/public/error.css" })
      }
    }
    countdownDates.sort((a, b) => a - b); // sort soonest to latest
    return res.render("countdown", { title: "Race Day Countdown", user: req.session.user, error: "", hasRaces: true, raceDate: JSON.stringify(countdownDates), otherCSS: "/public/countdown.css" });
  }
});

//export router
export default router;
