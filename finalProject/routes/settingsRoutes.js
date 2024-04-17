import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/home.js'; // need stuff from users db

router.route('/').get(async (req, res) => {
    res.render("./settings", { otherCss: "./countdown.css", title: "SETTINGS" });
});


//export router
export default router;