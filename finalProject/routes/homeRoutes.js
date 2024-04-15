import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/races.js'; // need stuff from race db
import path from 'path';

router.route('/').get(async (req, res) => {
    //render the home handlebars file
    res.render('./homepage/home.handlebars', { title: "Homepage", otherCss: "./home.css" });
});


//export router
export default router;