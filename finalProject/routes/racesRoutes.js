import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/races.js';
import * as help from '../helpers/helpers.js'

router.route('/').get(async (req, res) => {
    res.render("./races", { title: "Races", user: req.session.user });
});

router.route('/addrace').get(async (req, res) => {
  res.render("./addRace", { title: "Add race", user: req.session.user });
});

router.route('/searchraces').post(async (req, res) => {
    let search = req.body.search;
    try {
        search = help.notStringOrEmpty(search, 'race search');
    }
    catch (e) {
        res.status(404).render('error', { title: "Error", class: "error", error: "No races found", user: req.session.user });
    }
    try {
      const races = await data.search(search);
      if (!races || races.length === 0) {
        res.status(404).render('raceSearch', { title: "Error", search: `We're sorry, but no results were found for ${search}`, class: 'not-found', user: req.session.user });
        return;
      }
      res.render('raceSearch', { title: search, class: "search", races, user: req.session.user, search});
    } catch (error) {
      res.status(500).render('error', { title: "Error", error: 'Internal Server Error', class: 'error', user: req.session.user });
    }
});

router.route('/:id').get(async (req, res) => {
  
    let raceId = req.params.id;
    try {
        raceId = help.notStringOrEmpty(raceId, 'raceId'); // checks id, trims
    }
    catch (e) {
    res.status(404).render('error', { title: "Error", class: "error", error: "Not valid race", user: req.session.user});
    }
    try {
      let raceData = await data.get(raceId);
      
      if (raceData) {
        res.render('racePage', { title: raceData.raceName, user: req.session.user, error: "", name: raceData.raceName, location: raceData.location, date: raceData.date, time: raceData.raceTime, distance: raceData.distance, terrain: raceData.terrain, URL: raceData.raceUrl, registrants: raceData.registrants });
      }
    }
    catch (e) {
      res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString(), user: req.session.user });
    }
});

export default router;