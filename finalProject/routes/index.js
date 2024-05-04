//import route files and export them
import homeRoutes from "./homeRoutes.js"; // will have :raceId too
import profileRoutes from "./profileRoutes.js";
import racesRoutes from "./racesRoutes.js";

const constructorMethod = (app) => {
    app.use('/', homeRoutes);
    app.use('/profile', profileRoutes);
    app.use('/race', racesRoutes);
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;
