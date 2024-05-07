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
      res.render("profile", { owner, completedRaces: completedRaces, reviews: user.reviews, registeredRaces: registeredRaces, title: 'Profile', first: user.firstName.toUpperCase(), privacy: user.private, last: user.lastName.toUpperCase(), username: user.username, email: user.email.toUpperCase(), gender: user.gender.toUpperCase(), system: user.system.toUpperCase(), state: user.state.toUpperCase(), age: user.age, socialHandle: user.socialHandle, socialPlatform: user.socialPlatform.toUpperCase(), password: user.password, user: req.session.user, otherCSS: "/public/profile.css" })
    }
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), otherCSS: "/public/error.css" });
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

//export router
export default router;