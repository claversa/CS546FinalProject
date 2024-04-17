import { Router } from 'express';
const router = Router();
// Data file for the data functions
import * as data from '../data/home.js'; // need stuff from users db

router.route('/').get(async (req, res) => {
    //code here for GET will render the home handlebars file

    // get date of this user's next upcoming race from user info database

    // render date and other info in pages/countdown/countdown.handlebars
    // the otherCss is the other stylesheet that that page specifically uses so it should be IN THAT SAME FOLDER since it will be injected into the
    // handlebars file in that folder
    
    res.render("./training", { otherCss: "./countdown.css", title: "Race Day Countdown" });
});


//export router
export default router;