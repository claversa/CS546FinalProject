import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as races from '../data/races.js';
import * as data from '../data/users.js';
import * as help from '../helpers/helpers.js';
import xss from 'xss';

// default, get profile for given id
router.route('/:id').get(async (req, res) => {
  //code here for GET will render the home handlebars file

  let username = xss(req.params.id);
  try {
    username = help.notStringOrEmpty(username, 'username'); // checks id, trims
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "error", error: "Not valid username", otherCSS: "/public/error.css" });
  }
  try {
    let user = await data.get(username);
    let owner = false;
    if (user) {
      let racesCompleted = [];
      let raceName = undefined;
      for (const raceId of user.registeredRaces) {
        raceName = await races.isCompleted(raceId);
        if (raceName) {
          racesCompleted.push(raceId);
        }
      }
      // console.log(racesCompleted)
      if (user.private && !(req.session.user.username === username)) {
        throw "User has a private profile";
      }
      let registeredRaces = await races.getRaceNamesByIds(user.registeredRaces)

      if (user.username === req.session.user.username) owner = true;
      let completedRaces = await races.getRaceNamesByIds(racesCompleted)
      let privacy = undefined
      if (user.private === "true") {
        privacy = true;
      } else {
        privacy = false;
      }
      console.log(req.session.user);
      res.render("profile", { private: privacy, owner, completedRaces: completedRaces, reviews: user.reviews, registeredRaces: registeredRaces, title: 'Profile', first: user.firstName.toUpperCase(), privacy: user.private, last: user.lastName.toUpperCase(), username: user.username, email: user.email.toUpperCase(), gender: user.gender.toUpperCase(), system: user.system.toUpperCase(), state: user.state.toUpperCase(), age: user.age, socialHandle: user.socialHandle, socialPlatform: user.socialPlatform.toUpperCase(), password: user.password, user: req.session.user, otherCSS: "/public/profile.css" })
    }
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), otherCSS: "/public/error.css", user: req.session.user });
  }
});

router.route('/delete/:id').post(async (req, res) => {
  try {
    const username = xss(req.params.id);
    await data.deleteProfile(username);
    delete req.session.user;
    res.redirect("./home");
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/editGender/:id').post(async (req, res) => {
  try {
    const newGender = xss(req.body.gender);
    const username = xss(req.params.id);
    await data.updateGender(username, newGender);      
    res.status(200).json({ message: "Gender updated successfully" });
  } catch (e) {
    res.status(400).json({ error: "Invalid gender" });
  }
});

router.route('/editMeasurement/:id').post(async (req, res) => {
  try {
    const newSystem = xss(req.body.system);
    const username = xss(req.params.id);
    await data.updateSystem(username, newSystem);      
    res.status(200).json({ message: "Measurement updated successfully" });
  } catch (e) {
    res.status(400).json({ error: "Invalid measurement system" });
  }
});

router.route('/editState/:id').post(async (req, res) => {
  try {
    const newState = xss(req.body.state);
    const username = xss(req.params.id);
    await data.updateState(username, newState);      
    res.status(200).json({ message: "State updated successfully" });
  } catch (e) {
    res.status(400).json({ error: "Invalid state" });
  }
});

router.route('/editPlatform/:id').post(async (req, res) => {
  try {
    const newPlatform = xss(req.body.social_platform);
    const username = xss(req.params.id);
    await data.updatePlatform(username, newPlatform);      
    res.status(200).json({ message: "Platform updated successfully" });
  } catch (e) {
    res.status(400).json({ error: "Invalid platform" });
  }
});

router.route('/editHandle/:id').post(async (req, res) => {
  try {
    const newHandle = xss(req.body.social_handle);
    const username = xss(req.params.id);
    await data.updateHandle(username, newHandle);      
    res.status(200).json({ message: "Handle updated successfully" });
  } catch (e) {
    res.status(400).json({ error: "Invalid handle" });
  }
});

router.route('/editPrivacy/:id').post(async (req, res) => {
  try {
    const newPrivacy = xss(req.body.privacy_setting);
    const username = xss(req.params.id);
    await data.updatePrivacy(username, newPrivacy);      
    res.status(200).json({ message: "Privacy updated successfully" });
  } catch (e) {
    res.status(400).json({ error: "Invalid privacy" });
  }
});

router.route('/editPassword/:id').post(async (req, res) => {
  try {
    const newPassword = xss(req.body.password);
    const username = xss(req.params.id);
    await data.updatePassword(username, newPassword);      
    res.status(200).json({ message: "Privacy updated successfully" });
  } catch (e) {
    res.status(400).json({ error: "Invalid Password" });
  }
});

//export router
export default router;