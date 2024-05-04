import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/races.js';
import * as help from '../helpers/helpers.js'

router.route('/').get(async (req, res) => {
    res.render("./races", { title: "Races", user: req.session.user });
});

router.route('/searchraces').post(async (req, res) => {
    let search = req.body.search;
    try {
        search = help.notStringOrEmpty(search, 'race search');
    }
    catch (e) {
        res.status(404).render('error', { title: "Error", class: "error", error: "No races found" });
    }
    try {
      const races = await data.search(search);
      console.log(races)
      const get = await data.getAll();
      console.log(get)
      if (!search || search.length === 0) {
        res.status(404).render('error', { title: "Error", error: `We're sorry, but no results were found for ${search}`, class: 'not-found' });
        return;
      }
      res.render('raceSearch', { title: search, class: "search", searchRaceByName: races, user: req.session.user });
    } catch (error) {
      res.status(500).render('error', { title: "Error", error: 'Internal Server Error', class: 'error' });
    }
});

router.route('/:id').get(async (req, res) => {
  
    let raceId = req.params.id;
    try {
        raceId = help.notStringOrEmpty(raceId, 'raceId'); // checks id, trims
    }
    catch (e) {
    res.status(404).render('error', { title: "Error", class: "error", error: "Not valid race" });
    }
    try {
      let raceData = await data.get(raceId);
      if (raceData) {
        res.render('racePage', { title: raceData.data.name, user: req.session.user, error: "", name: raceData.data.name, location: raceData.data.location, date: raceData.data.date, time: raceData.data.time, distance: raceData.data.distance, terrain: raceData.data.terrain, URL: raceData.data.URL, registrants: raceData.data.registrants });
      }
    }
    catch (e) {
      res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString() });
    }
});

export default router;