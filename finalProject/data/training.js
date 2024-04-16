import { plans } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import * as help from '../helpers.js';

const create = async (
    raceId,
    raceName,
    raceDate,
    distance,
    maxMileageYet,
    tempoPace,
    racePace
) => {
    // exists
    let args = [reviewName, raceId, raceName, raceCity, raceState, raceDate, distance, authorFirstName, authorLastName, username, gender, age, authorId, comments, rating]
    args.map((elem) => help.exists(elem, elem));
    // not string or empty, trims all input as well
    let strs = [reviewName, raceId, raceName, raceCity, raceState, raceDate, distance, authorFirstName, authorLastName, username, gender, authorId, comments]
    strs = args.map((elem) => help.notStringOrEmpty(elem, elem));
    // split again into individual vars
    let { reviewName, raceId, raceName, raceCity, raceState, raceDate, distance, authorFirstName, authorLastName, username, gender, authorId, comments } = strs;
    // age
    if (typeof age !== 'number' || Number.isNaN(age) || age < 13 || age > 117) throw "Error: age must be a number between 13 and 117"
    age = Math.round(age); // make age a whole number
    // rating
    if (typeof rating !== 'number' || Number.isNaN(rating) || rating <= 0 || rating > 5) throw "Error: rating must be a number between 1 and 5"
    rating = Math.round(rating); // make rating a whole number
    // date
    help.validDate(raceDate);
    // distance
    if (typeof distance !== 'number' || Number.isNaN(distance) || distance < 0) throw "Error: Distance must be a number"
    // state 
    state = help.validState(state); // to upper case
    // time
    help.validRaceTime(raceTimeHr, raceTimeMin);

    let basePlanHalf = [[0, 3, 2, 3, 0, 1, 4], [0, 3, 2, 3, 0, 1, 4], [0, 3.5, 2, 3.5, 0, 1, 5], [0, 3.5, 2, 3.5, 0, 1, 5], [0, 4, 2, 4, 0, 1, 6], [0, 4, 2, 4, 1, 0, 3.1], [0, 4.5, 3, 4.5, 0, 1, 7], [0, 4.5, 3, 4.5, 0, 1, 8], [0, 5, 3, 5, 0, 1, 9], [0, 5, 3, 5, 0, 1, 10], [0, 4, 3, 2, 0, 0, 13.2]];

    // construct review
    let newReview = {

    };
    const productCollection = await plans();
    const insertInfo = await productCollection.insertOne(newProd);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add product';

    const newId = insertInfo.insertedId.toString();

    const prod = await get(newId);
    return prod;
};

const getAll = async () => {
    const productCollection = await products();
    let prodList = await productCollection.find({}).toArray(); // get all products, put in array
    if (!prodList) throw 'Could not get all products';
    prodList = prodList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return prodList;
};

const get = async (id) => {
    let x = new ObjectId();
    exists(id, 'id');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    const productCollection = await products();
    const prod = await productCollection.findOne({ _id: new ObjectId(id) });
    if (prod === null) throw 'No product with that id';
    prod._id = prod._id.toString();
    return prod;
};



const remove = async (id) => {
    exists(id, 'id');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    const reviewCollection = await reviews();
    const deletionInfo = await reviewCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (!deletionInfo) {
        throw `Could not delete review with id of ${id}`;
    }
    return `${deletionInfo.reviewName} has been successfully deleted!`;
};