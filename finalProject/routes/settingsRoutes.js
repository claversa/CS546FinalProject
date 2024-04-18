import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/home.js'; // need stuff from users db

router.route('/').get(async (req, res) => {
    res.render("./settings", { title: "Settings", user: req.session.user });
});


export default router;