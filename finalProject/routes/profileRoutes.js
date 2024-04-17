import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/users.js';
import * as help from '../helpers/helpers.js'

router.route('/login').get(async (req, res) => {
  //render the home handlebars file
  res.render('./login/login', { title: "Login", otherCss: "./login.css" });
});
router.route('/createProfile')
.get(async (req, res) => {
  //render the home handlebars file
  res.render('./createProfile/createProfile', { title: "createProfile", otherCss: "./createProfile.css" });
})
.post(async (req, res) => {
  //code here for POST this is where profile form will be submitting new user and then call your data function passing in the profile info   and then rendering the search results of up to 20 Movies.
  const profileInfo = req.body; // form info!
  let first = profileInfo.firstName;
  let last = profileInfo.lastName;
  let username = profileInfo.username;
  let email = profileInfo.email;
  let age = profileInfo.age;
  let city = profileInfo.city;
  let state = profileInfo.state;
  let gender = profileInfo.gender;
  let system = profileInfo.system;
  let socialPlatform = profileInfo.social_platform;
  let socialHandle = profileInfo.social_handle;
  let password = profileInfo.password;
  console.log(req.body)
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
      age,
      socialPlatform,
      socialHandle,
      system,
      password); // create user
      console.log("here")
    console.log(newUser)
    // take user to homepage but now logged in
    res.render(".homepage/home", { title: "Homepage", otherCss: './home.css' });
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString() });
  }
});

// default, get profile for given id
router.route('/:id').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  //CHECK ID

  let userId = req.params.id;
  try {
    userId = help.checkString(userId, 'user id'); // checks id, trims
  }
  catch (e) {
    res.status(404).render('error', { otherCss: './error.css', title: "Error", class: "error", error: "Id must be present and must be of proper format" });
  }
  try {
    let user = await data.get(userId);
    if (user) {
      res.render("./profile/profile", { title: 'Profile', first: user.firstName.toUpperCase(), last: user.lastName.toUpperCase(), username: user.username, email: user.email.toUpperCase(), gender: user.gender.toUpperCase(), system: user.system.toUpperCase(), state: user.state.toUpperCase(), city: user.city.toUpperCase(), age: user.age, socialHandle: user.socialHandle, socialPlatform: user.socialPlatform.toUpperCase(), password: user.password })
    }
  }
  catch (e) {
    res.status(404).render('error', { otherCss: './error.css', title: "Error", class: "not-found", error: e.toString() });
  }
});

//export router
export default router;