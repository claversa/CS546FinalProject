<<<<<<< HEAD
import { races } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import * as help from '../helpers/helpers.js';


const create = async (
    raceName,
    raceCity,
    raceState,
    raceDate,
    raceTimeHr,
    raceTimeMin,
    distance,
    terrain,
    raceUrl
) => {
    //SPLIT UP
    raceName = help.notStringOrEmpty(raceName, "race name");
    raceCity = help.notStringOrEmpty(raceCity, "raceCity");
    raceState = help.notStringOrEmpty(raceState, "raceState");
    raceTimeHr = help.notStringOrEmpty(raceTimeHr, "raceTimeHr");
    raceTimeMin = help.notStringOrEmpty(raceTimeMin, "raceTimeMin");
    distance = help.notStringOrEmpty(distance, "distance");
    terrain = help.arraysWithStringElem(terrain, "terrain");
    raceUrl = help.notStringOrEmpty(raceUrl, "raceUrl");

    // validate url
    help.validURL(raceUrl);


    // // not string or empty, trims all input as well
    // let strs = [raceName, raceCity, raceState, raceDate, raceTimeHr, raceTimeMin, raceUrl];
    // strs = strs.map((str) => help.notStringOrEmpty(str, str));
    // //split strs back into individual vars
    // let { raceName, raceCity, raceState, raceDate, raceTimeHr, raceTimeMin, raceUrl } = strs;
    // website
    help.validWebsite(raceUrl);
    // date
    help.validDate(raceDate);
    // distance
    if (typeof distance !== 'number' || Number.isNaN(distance) || distance < 0) throw "Error: Distance must be a number"
    // state 
    state = help.validState(state); // to upper case
    // time
    help.validRaceTime(raceTimeHr, raceTimeMin);


    //make new race to be inserted
    let newRace = { raceName, raceCity, raceState, raceDate, raceTime, distance, terrain, raceUrl };
    const raceCollection = await races();
    const insertInfo = await raceCollection.insertOne(newRace);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add race';

    const newId = insertInfo.insertedId.toString();

    const race = await get(newId);
    return race;
};

const getAll = async () => {
    const raceCollection = await races();
    let raceList = await raceCollection.find({}).toArray(); // get all products, put in array
    if (!raceList) throw 'Could not get all races';
    raceList = raceList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return raceList;
};

const get = async (id) => {
    let x = new ObjectId();
    exists(id, 'id');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (race === null) throw 'No product with that id';
    race._id = race._id.toString();
    return race;
=======
import { races } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import * as help from '../helpers/helpers.js';


const create = async (
    raceName,
    raceCity,
    raceState,
    raceDate,
    raceTimeHr,
    raceTimeMin,
    distance,
    terrain,
    raceUrl
) => {
    //SPLIT UP
    raceName = help.notStringOrEmpty(raceName, "race name");
    raceCity = help.notStringOrEmpty(raceCity, "raceCity");
    raceState = help.notStringOrEmpty(raceState, "raceState");
    raceTimeHr = help.notStringOrEmpty(raceTimeHr, "raceTimeHr");
    raceTimeMin = help.notStringOrEmpty(raceTimeMin, "raceTimeMin");
    distance = help.notStringOrEmpty(distance, "distance");
    terrain = help.arraysWithStringElem(terrain, "terrain");
    raceUrl = help.notStringOrEmpty(raceUrl, "raceUrl");

    // validate url
    help.validURL(raceUrl);


    // // not string or empty, trims all input as well
    // let strs = [raceName, raceCity, raceState, raceDate, raceTimeHr, raceTimeMin, raceUrl];
    // strs = strs.map((str) => help.notStringOrEmpty(str, str));
    // //split strs back into individual vars
    // let { raceName, raceCity, raceState, raceDate, raceTimeHr, raceTimeMin, raceUrl } = strs;
    // website
    help.validWebsite(raceUrl);
    // date
    help.validDate(raceDate);
    // distance
    if (typeof distance !== 'number' || Number.isNaN(distance) || distance < 0) throw "Error: Distance must be a number"
    // state 
    state = help.validState(state); // to upper case
    // time
    help.validRaceTime(raceTimeHr, raceTimeMin);


    //make new race to be inserted
    let newRace = { raceName, raceCity, raceState, raceDate, raceTime, distance, terrain, raceUrl };
    const raceCollection = await races();
    const insertInfo = await raceCollection.insertOne(newRace);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add race';

    const newId = insertInfo.insertedId.toString();

    const race = await get(newId);
    return race;
};

const getAll = async () => {
    const raceCollection = await races();
    let raceList = await raceCollection.find({}).toArray(); // get all products, put in array
    if (!raceList) throw 'Could not get all races';
    raceList = raceList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return raceList;
};

const get = async (id) => {
    let x = new ObjectId();
    exists(id, 'id');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (race === null) throw 'No product with that id';
    race._id = race._id.toString();
    return race;
>>>>>>> dac752c (countdown works now)
};