import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/races.js';
import * as help from '../helpers/helpers.js'

router.route('/').get(async (req, res) => {
    res.render("./races", { title: "Races", user: req.session.user });
});

router.route('/searchraces').post(async (req, res) => {
    let search = req.body.searchRaceByName;
    try {
        search = help.notStringOrEmpty(search, 'race search');
    }
    catch (e) {
        res.status(404).render('error', { title: "Error", class: "error", error: "No races found" });
    }
    try {
      const race = await data.search(search);
      if (!search || search.length === 0) {
        res.status(404).render('error', { title: "Error", error: `We're sorry, but no results were found for ${search}`, class: 'not-found' });
        return;
      }
      res.render('raceSearch', { });
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
      let race = await data.get(raceId);
      if (race) {
        res.render("racePage", { title: 'Race Page' })
      }
    }
    catch (e) {
      res.status(404).render('error', { title: "Error", class: "not-found", error: e.toString() });
    }
  });

export default router;