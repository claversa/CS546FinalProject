import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/races.js';
import * as help from '../helpers/helpers.js'

router.route('/').get(async (req, res) => {
  res.render("./races", { title: "Races", user: req.session.user, otherCSS: "/public/registeredRaces.css" });
});

router.route('/addrace')
  .get(async (req, res) => {
    res.render("./addRace", { title: "Add race", user: req.session.user, otherCSS: "/public/addRace.css" });
  }).post(async (req, res) => {
    //code here for POST this is where profile form will be submitting new user and then call your data function passing in the profile info   and then rendering the search results of up to 20 Movies.
    const raceInfo = req.body; // form info!
    let raceName = raceInfo.raceName;
    let raceCity = raceInfo.raceCity;
    let raceState = raceInfo.raceState;
    let raceDate = raceInfo.raceDate;
    let raceTime = raceInfo.raceTime;
    let distance = raceInfo.distance;
    let terrain = raceInfo.terrain;
    let raceUrl = raceInfo.raceUrl;

    // CHECK ALL THESE ^^^^^^^^^^^^^^66
    // -------------------- check
    // try {
    //   help.checkString(movieName, "movie name");
    // }
    // catch (e) {
    //   res.status(400).render('error', { title: "Error", class: "error", error: e.toString() });
    // }
    try {
      let newRace = await data.create(
        raceName,
        req.session.user.username,
        raceCity,
        raceState,
        raceDate,
        raceTime,
        distance,
        terrain,
        raceUrl); // create race
      // take user to homepage but now logged in
      console.log(newRace)
      res.redirect(`/race/${newRace._id}`);
    }
    catch (e) {
      res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), otherCSS: "/public/error.css" });
    }
  });

router.route('/searchraces').post(async (req, res) => {
  let search = req.body.search;
  try {
    search = help.notStringOrEmpty(search, 'race search');
  }
  catch (e) {
    res.status(404).render('raceSearch', { title: "Error", class: "not-found", search: "Please put a valid search so no blanks", user: req.session.user, otherCSS: "/public/error.css" });
  }
  try {
    const races = await data.search(search);
    if (!races || races.length === 0) {
      res.status(404).render('raceSearch', { title: "Error", search: `We're sorry, but no results were found for ${search}`, class: 'not-found', user: req.session.user, otherCSS: "/public/raceSearch.css" });
      return;
    }
    if (races.length > 20) races = races.slice(0, 20);
    res.render('raceSearch', { title: search, class: "search", races, user: req.session.user, search, otherCSS: "/public/reaceSearch.css" });
  } catch (error) {
    res.status(500).render('error', { title: "Error", error: 'Internal Server Error', class: 'error', user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/:id').get(async (req, res) => {

  let raceId = req.params.id;
  try {
    raceId = help.notStringOrEmpty(raceId, 'raceId'); // checks id, trims
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "error", error: "Not valid race", user: req.session.user, otherCSS: "/public/error.css" });
  }
  try {
    let raceData = await data.get(raceId);

    if (raceData) {
      let registered = false;
      if (raceData.registeredUsers.includes(req.session.user.username)) {
        registered = true;
      }
      res.render('racePage', { registered, registrants: raceData.registeredUsers, title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/racePage.css", raceId });
    }
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

export default router;