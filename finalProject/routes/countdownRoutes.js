import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/users.js'; // need stuff from users db

router.route('/').get(async (req, res) => {
    res.render("./countdown", { title: "Race Day Countdown", user: req.session.user});
});

export default router;