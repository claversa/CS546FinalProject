import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/users.js';
import * as help from '../helpers/helpers.js'

router.route('/createProfile')
  .get(async (req, res) => {
    //render the home handlebars file
    res.render('./createProfile', { title: "Create Profile", user: req.session.user });
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
      res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString() });
    }
  });

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