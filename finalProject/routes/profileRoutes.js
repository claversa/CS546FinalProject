import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/users.js';
import * as help from '../helpers/helpers.js'

// default, get profile for given id
router.route('/:id').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  //CHECK ID

  let username = req.params.id;
  try {
    username = help.notStringOrEmpty(username, 'username'); // checks id, trims
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "error", error: "Not valid username" });
  }
  try {
    let user = await data.get(username)
    if (user) {
      res.render("profile", { title: 'Profile', first: user.firstName.toUpperCase(), last: user.lastName.toUpperCase(), username: user.username, email: user.email.toUpperCase(), gender: user.gender.toUpperCase(), system: user.system.toUpperCase(), state: user.state.toUpperCase(), birthday: user.birthday, socialHandle: user.socialHandle, socialPlatform: user.socialPlatform.toUpperCase(), password: user.password, user: req.session.user })
    }
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString() });
  }
});

//export router
export default router;