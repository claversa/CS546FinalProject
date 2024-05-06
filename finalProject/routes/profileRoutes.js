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
  //CHECK ID

  let username = xss(req.params.id);
  try {
    username = help.notStringOrEmpty(username, 'username'); // checks id, trims
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "error", error: "Not valid username", otherCSS: "/public/error.css" });
  }
  try {
    let user = await data.get(username);
    if (user) {
      if (user.private && !(req.session.user.username === username)) {
        throw "User has a private profile";
      }
      let registeredRaces = await races.getRaceNamesByIds(user.registeredRaces)
      res.render("profile", { reviews: user.reviews, registeredRaces: registeredRaces, title: 'Profile', first: user.firstName.toUpperCase(), privacy: user.private, last: user.lastName.toUpperCase(), username: user.username, email: user.email.toUpperCase(), gender: user.gender.toUpperCase(), system: user.system.toUpperCase(), state: user.state.toUpperCase(), age: user.age, socialHandle: user.socialHandle, socialPlatform: user.socialPlatform.toUpperCase(), password: user.password, user: req.session.user, otherCSS: "/public/profile.css" })
    }
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), otherCSS: "/public/error.css" });
  }
});

//export router
export default router;