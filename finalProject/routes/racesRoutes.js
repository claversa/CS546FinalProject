import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/races.js';
import * as help from '../helpers/helpers.js'
import { ObjectId } from "mongodb";
import xss from 'xss';

router.route('/').get(async (req, res) => {
  res.render("./races", { title: "Races", user: req.session.user, otherCSS: "/public/registeredRaces.css" });
});

router.route('/delete/:raceId').post(async (req, res) => {
  try {
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await data.deleteRace(raceId);
    res.redirect("./home");
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/edit/:raceId').get(async (req, res) => {

  try {
    let errorMessage = undefined;
    if (req.session.errorMessage) {
      errorMessage = req.session.errorMessage;
      delete req.session.errorMessage;
    }
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    const raceData = await data.get(raceId);
    res.render('editRace', { title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: errorMessage, name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/editRace.css", raceId });
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/editName/:raceId').post(async (req, res) => {
  try {
    let name = xss(req.body.raceName);
    name = help.notStringOrEmpty(name);
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await data.updateName(raceId, name);
    res.redirect(`/race/edit/${raceId}`);
    // res.render('editRace', { title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/editRace.css", raceId });
  }
  catch (e) {
    const raceId = xss(req.params.raceId);
    req.session.errorMessage = "Error: invalid name"
    res.redirect(`/race/edit/${raceId}`);

    // res.status(404).render('editRace', { title: "Error", class: "not-found", error: "Error: invalid name", user: req.session.user, otherCSS: "/public/editRace.css" });
    // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/editState/:raceId').post(async (req, res) => {
  try {
    let state = xss(req.body.raceState);
    state = help.notStringOrEmpty(state);
    state = help.validState(state);
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await data.updateState(raceId, state);
    res.redirect(`/race/edit/${raceId}`);
    // res.render('editRace', { title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/editRace.css", raceId });
  }
  catch (e) {
    const raceId = xss(req.params.raceId);
    req.session.errorMessage = "Error: invalid state"
    res.redirect(`/race/edit/${raceId}`);
    // res.status(404).render('editRace', { title: "Error", class: "not-found", error: "Error: invalid state", user: req.session.user, otherCSS: "/public/editRace.css" });
    // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/editCity/:raceId').post(async (req, res) => {
  try {
    let city = xss(req.body.raceCity);
    city = help.notStringOrEmpty(city);
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await data.updateCity(raceId, city);
    res.redirect(`/race/edit/${raceId}`);
    // res.render('editRace', { title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/editRace.css", raceId });
  }
  catch (e) {
    const raceId = xss(req.params.raceId);
    req.session.errorMessage = "Error: invalid city"
    res.redirect(`/race/edit/${raceId}`);
    // res.status(404).render('editRace', { title: "Error", class: "not-found", error: "Error: invalid city", user: req.session.user, otherCSS: "/public/editRace.css" });
    // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/editDate/:raceId').post(async (req, res) => {
  try {
    let date = xss(req.body.raceDate);
    date = help.validDate(date)
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await data.updateDate(raceId, date);
    res.redirect(`/race/edit/${raceId}`);
    // res.render('editRace', { title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/editRace.css", raceId });
  }
  catch (e) {
    const raceId = xss(req.params.raceId);
    req.session.errorMessage = "Error: invalid date"
    res.redirect(`/race/edit/${raceId}`);
    // res.status(404).render('editRace', { title: "Error", class: "not-found", error: "Error: invalid date", user: req.session.user, otherCSS: "/public/editRace.css" });
    // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/editTime/:raceId').post(async (req, res) => {
  try {
    let time = xss(req.body.raceTime);
    time = help.validTime(time);
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await data.updateTime(raceId, time);
    res.redirect(`/race/edit/${raceId}`);
    // res.render('editRace', { title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/editRace.css", raceId });
  }
  catch (e) {
    const raceId = xss(req.params.raceId);
    req.session.errorMessage = "Error: invalid time"
    res.redirect(`/race/edit/${raceId}`);
    // res.status(404).render('editRace', { title: "Error", class: "not-found", error: "Error: invalid time", user: req.session.user, otherCSS: "/public/editRace.css" });
    // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

// router.route('/editDistance/:raceId').post(async (req, res) => {
//   try {
//     const distance = xss(req.body.distance);
//     let validDist = ["5K", "Half Marathon", "Marathon"];
//     if (!(validDist.includes(distance))) {
//       throw "Error: Invalid distance";
//     }
//     const raceId = xss(req.params.raceId);
//     if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
//     await data.updateDistance(raceId, distance);
//     res.redirect(`/race/edit/${raceId}`);
//     // res.render('editRace', { title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/editRace.css", raceId });
//   }
//   catch (e) {
//     const raceId = xss(req.params.raceId);
//     req.session.errorMessage = "Error: invalid distance"
//     res.redirect(`/race/edit/${raceId}`);
//     // res.status(404).render('editRace', { title: "Error", class: "not-found", error: "Error: invalid distance", user: req.session.user, otherCSS: "/public/editRace.css" });
//     // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
//   }
// });

router.route('/editTerrain/:raceId').post(async (req, res) => {
  let terrain = [];
  try {
    for (let x of req.body.terrain) {
      let value = xss(x);
      terrain.push(value);
    }
  } catch (e) {
    throw "invalid terrain 2";
  }
  try {
    let validTerrain = ["Street", "Grass", "Beach", "Rocky", "Inclined", "Muddy"];
    // let terrain = xss(req.body.terrain);
    if (!terrain) throw "Terrain cannot be null";
    if (!Array.isArray(terrain)) {
      terrain = [terrain];
      if (!(validTerrain.includes(ter))) throw "Error: Invalid terrain";
    }
    else {
      terrain = help.arraysWithStringElem(terrain, "terrain");
      for (let ter of terrain) {
        if (!(validTerrain.includes(ter))) {
          throw "Error: Invalid terrain";
        }
      }
    }
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await data.updateTerrain(raceId, terrain);
    res.redirect(`/race/edit/${raceId}`);
    // res.render('editRace', { title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/editRace.css", raceId });
  }
  catch (e) {
    const raceId = xss(req.params.raceId);
    req.session.errorMessage = "Error: invalid terrain"
    res.redirect(`/race/edit/${raceId}`);
    // res.status(404).render('editRace', { title: "Error", class: "not-found", error: "Error: invalid terrain choices", user: req.session.user, otherCSS: "/public/editRace.css" });
    // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/editUrl/:raceId').post(async (req, res) => {
  try {
    let url = xss(req.body.raceUrl);
    raceUrl = help.notStringOrEmpty(raceUrl, "race URL");
    help.validURL(raceUrl);
    const raceId = xss(req.params.raceId);
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
    await data.updateUrl(raceId, url);
    res.redirect(`/race/edit/${raceId}`);
    // res.render('editRace', { title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/editRace.css", raceId });
  }
  catch (e) {
    req.session.errorMessage = "Error: invalid url"
    const raceId = xss(req.params.raceId);
    res.redirect(`/race/edit/${raceId}`);
    // res.status(404).render('editRace', { title: "Error", class: "not-found", error: "Error: invalid url", user: req.session.user, otherCSS: "/public/editRace.css" });
    // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/addrace')
  .get(async (req, res) => {
    res.render("./addRace", { title: "Add race", user: req.session.user, otherCSS: "/public/addRace.css" });
  }).post(async (req, res) => {
    const errors = [];
    //code here for POST this is where profile form will be submitting new user and then call your data function passing in the profile info   and then rendering the search results of up to 20 Movies.
    const raceInfo = req.body; // form info!
    let raceName = xss(raceInfo.raceName);
    let raceCity = xss(raceInfo.raceCity);
    let raceState = xss(raceInfo.raceState);
    let raceDate = xss(raceInfo.raceDate);
    let raceTime = xss(raceInfo.raceTime);
    let distance = xss(raceInfo.distance);
    let terrain = [];
    let emptyT = false;
    try {
      for (let x of raceInfo.terrain) {
        let value = xss(x);
        terrain.push(value);
      }
    } catch (e) {
      emptyT = true;
    }
    let raceUrl = xss(raceInfo.raceUrl);


    try {
      raceName = help.notStringOrEmpty(raceName, "race name");
    } catch (e) {
      errors.push(`invalid race name`);
    }

    try {
      raceCity = help.notStringOrEmpty(raceCity, "race city");
    } catch (e) {
      errors.push(`invalid race city`);
    }

    try {
      raceState = help.notStringOrEmpty(raceState, "race state");
      raceState = help.validState(raceState);
    } catch (e) {
      errors.push(`invalid race state`);
    }

    try {
      raceTime = help.notStringOrEmpty(raceTime, "race time");
      raceTime = help.validTime(raceTime);
    } catch (e) {
      errors.push(`invalid race time`);
    }

    try {
      let validTerrain = ["Street", "Grass", "Beach", "Rocky", "Inclined", "Muddy"];
      if (!Array.isArray(terrain)) {
        terrain = [terrain];
        if (!(validTerrain.includes(terrain))) throw "Error: Invalid terrain";
      }
      else {
        terrain = help.arraysWithStringElem(terrain, "terrain");
        for (let ter of terrain) {
          if (!(validTerrain.includes(ter))) {
            throw "Error: Invalid terrain";
          }
        }
      }
    } catch (e) {
      console.log(e);
      if (emptyT) errors.push("terrain can not be empty");
      else errors.push(`invalid terrain 4`);
    }

    try {
      raceUrl = help.notStringOrEmpty(raceUrl, "race URL");
      help.validURL(raceUrl);
    } catch (e) {
      errors.push(`invalid race URL: must be of form https://www.{url}.{com,org,etc}`);
    }

    try {
      // Validate date
      help.validDate(raceDate);
      if (!help.isDateAfterToday(raceDate, raceTime)) throw "Error: Race date must be after today's date";
    } catch (e) {
      errors.push(`invalid date: must be valid format and after today's date and time`);
    }

    try {
      // Validate distance
      let validDist = ["5K", "Half Marathon", "Marathon"];
      if (!(validDist.includes(distance))) {
        throw "Error: Invalid distance";
      }
    } catch (e) {
      errors.push(`invalid distance`);
    }


    // Check for errors and handle accordingly
    if (errors.length > 0) {
      return res.status(404).render('addRace', { title: "Error", class: "not-found", error: errors, user: req.session.user, otherCSS: "/public/addRace.css" });
    }
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
      res.redirect(`/race/${newRace._id}`);
    }
    catch (e) {
      res.status(404).render('addRace', { title: "Error", class: "not-found", error: e, user: req.session.user, otherCSS: "/public/addRace.css" });
      // res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), otherCSS: "/public/error.css" });
    }
  });

router.route('/searchraces').post(async (req, res) => {
  let search = xss(req.body.search);
  try {
    search = help.notStringOrEmpty(search, 'race search');
  }
  catch (e) {
    res.status(404).render('raceSearch', { title: "Error", class: "not-found", search: "Please put a valid search so no blanks", user: req.session.user, otherCSS: "/public/raceSearch.css" });
    return;
  }
  try {
    // let search = xss(req.body.search);
    const races = await data.search(search);
    if (!races || races.length === 0) {
      res.status(404).render('raceSearch', { title: "Error", search: `We're sorry, but no results were found for ${search}`, class: 'not-found', user: req.session.user, otherCSS: "/public/raceSearch.css" });
      return;
    }
    if (races.length > 20) races = races.slice(0, 20);
    res.render('raceSearch', { title: "Search", class: "search", races, user: req.session.user, search, otherCSS: "/public/raceSearch.css" });
  } catch (error) {
    res.status(500).render('error', { title: "Error", error: 'Internal Server Error', class: 'error', user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/searchState').post(async (req, res) => {
  let search = xss(req.body.search);
  try {
    search = help.notStringOrEmpty(search, 'race search');
    search = help.validState(search)
  }
  catch (e) {
    res.status(404).render('raceSearch', { title: "Error", class: "not-found", search: "Please select a state", user: req.session.user, otherCSS: "/public/raceSearch.css" });
    return;
  }
  try {
    const races = await data.searchByState(search);
    if (!races || races.length === 0) {
      res.status(404).render('raceSearch', { title: "Error", search: `We're sorry, but no results were found for ${search}`, class: 'not-found', user: req.session.user, otherCSS: "/public/raceSearch.css" });
      return;
    }
    if (races.length > 20) races = races.slice(0, 20);
    res.render('raceSearch', { title: "Search", class: "search", races, user: req.session.user, search, otherCSS: "/public/raceSearch.css" });
  } catch (error) {
    res.status(500).render('error', { title: "Error", error: 'Internal Server Error', class: 'error', user: req.session.user, otherCSS: "/public/error.css" });
  }
});

router.route('/:id').get(async (req, res) => {
  let raceId = xss(req.params.id);
  try {
    raceId = help.notStringOrEmpty(raceId, 'raceId'); // checks id, trims
    if (!ObjectId.isValid(raceId)) throw 'invalid race ID';
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "error", error: "Not valid race", user: req.session.user, otherCSS: "/public/error.css" });
    return;
  }

  try {
    if (raceId === "searchraces" || raceId === "searchState") {
      res.status(404).render('raceSearch', { title: "Error", class: "not-found", search: "Please search again", user: req.session.user, otherCSS: "/public/raceSearch.css" });
      return;
    }
    let raceData = await data.get(raceId);

    if (raceData) {
      let owner = false;
      if (raceData.username === req.session.user.username) owner = true;
      let registered = false;
      if (raceData.registeredUsers.includes(req.session.user.username)) registered = true;
      res.render('racePage', { owner, reviews: raceData.reviews, comments: raceData.comments, registered, registrants: raceData.registeredUsers, title: raceData.raceName, name: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, city: raceData.raceCity, state: raceData.raceState, date: raceData.raceDate, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, otherCSS: "/public/racePage.css", raceId });
    }
  }
  catch (e) {
    res.status(404).render('error', { title: "Error", class: "not-found", error: "Race not found", user: req.session.user, otherCSS: "/public/error.css" });
  }
});

export default router;