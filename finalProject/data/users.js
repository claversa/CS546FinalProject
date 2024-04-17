import { users } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import * as help from '../helpers/helpers.js';
import * as pw from '../helpers/bcrypt.js'


// create new user
const create = async (
    firstName,
    lastName,
    username,
    email,
    city,
    state,
    gender,
    age,
    socialPlatform,
    socialHandle,
    system,
    password
) => {
    // exists, not string or empty, trims all input as well
    firstName = help.notStringOrEmpty(firstName, "firstName");
    lastName = help.notStringOrEmpty(lastName, "lastName");
    email = help.notStringOrEmpty(email, "email");
    city = help.notStringOrEmpty(city, "city");
    state = help.notStringOrEmpty(state, "state");
    gender = help.notStringOrEmpty(gender, "gender");
    socialPlatform = help.notStringOrEmpty(socialPlatform, "social platform");
    socialHandle = help.notStringOrEmpty(socialHandle, "social handle");
    system = help.notStringOrEmpty(system, "system");
    password = help.notStringOrEmpty(password, "password");

    if (!age) throw 'Error: age is undefined'
    // valid abbrev and makes uppercase
    state = help.validState(state);


    //validate email -- NO DUPLICATES EVEN WITH CAPS
    email = email.toLowerCase();
    // HOW DO I VALIDATE !!!!!!!!!!!!!!!

    // password
    let hashedPW = pw.hashPassword(password);

    //make empty arrays for registered races and training plans that will be filled in later
    let registeredRaces = [];
    let trainingPlans = [];

    // make old passwords array to prevent old passwords being used, add current pw
    let oldPWs = [hashedPW];

    let newUser = {
        firstName,
        lastName,
        username,
        email,
        city,
        state,
        gender,
        age,
        socialPlatform,
        socialHandle,
        system,
        hashedPW,
        oldPWs,
        registeredRaces,
        trainingPlans
    };
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add user';

    const newId = insertInfo.insertedId.toString();

    const user = await get(newId);
    return user;
};

// get all users
const getAll = async () => {
    const userCollection = await users();
    let userList = await userCollection.find({}).toArray(); // get all users, put in array
    if (!userList) throw 'Could not get all products';
    userList = userList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return userList;
};

// get specific user
const get = async (id) => {
    let x = new ObjectId();
    exists(id, 'id');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (user === null) throw 'No user with that id';
    user._id = user._id.toString();
    return user;
};


// remove user ????
// const remove = async (id) => {
//     exists(id, 'id');
//     id = notStringOrEmpty(id, 'id');
//     if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
//     const userCollection = await users();
//     const deletionInfo = await userCollection.findOneAndDelete({
//         _id: new ObjectId(id)
//     });
//     if (!deletionInfo) {
//         throw `Could not delete user with id of ${id}`;
//     }
//     return `${deletionInfo.firstName} ${deletionInfo.lastName} has been successfully deleted!`;
// };


// UPDATE METHODS
// can update email, city, state, gender, social, system, password, registeredRaces, trainingPlans
// cant update name, username, age
const updateEmail = async (id, newEmail) => {
    exists(id, 'id');
    exists(newEmail, 'email');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid ID
    newEmail = notStringOrEmpty(newEmail, 'email');
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    // CHECK IF UNIQUE!!
    // --------------------------------------------------
    // already set
    if (newEmail.toLowerCase() === user.email.toLowerCase()) throw `Error: Email is already ${user.email}`
    const updatedUser = {
        email: newEmail
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updateCity = async (id, newCity) => {
    exists(id, 'id');
    exists(newCity, 'city');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid ID
    newCity = notStringOrEmpty(newCity, 'city');
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    // already set
    if (newCity.toLowerCase() === user.city.toLowerCase()) throw `Error: City is already ${user.city}`
    const updatedUser = {
        city: newCity
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updateState = async (id, newState) => {
    exists(id, 'id');
    exists(newState, 'state');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid ID
    newState = notStringOrEmpty(newState, 'state');
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    // already set
    if (newState.toLowerCase() === user.state.toLowerCase()) throw `Error: State is already ${user.state}`
    const updatedUser = {
        state: newState
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updateGender = async (id, newGender) => {
    exists(id, 'id');
    exists(newGender, 'gender');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid ID
    newGender = notStringOrEmpty(newGender, 'gender');
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    // already set
    if (newGender.toLowerCase() === user.gender.toLowerCase()) throw `Error: Gender is already ${user.gender}`
    const updatedUser = {
        gender: newGender
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updateSocial = async (id, newSocial) => {
    exists(id, 'id');
    exists(newSocial, 'social');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid ID
    newSocial = notStringOrEmpty(newSocial, 'social');
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    // already set
    if (newSocial.toLowerCase() === user.social.toLowerCase()) throw `Error: Social is already ${user.social}`
    const updatedUser = {
        social: newSocial
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updateSystem = async (id, newSystem) => {
    exists(id, 'id');
    exists(newSystem, 'system');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid ID
    newSystem = notStringOrEmpty(newSystem, 'system');
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    // already set
    if (newSystem.toLowerCase() === user.system.toLowerCase()) throw `Error: System is already ${user.system}`
    const updatedUser = {
        system: newSystem
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};


const updatePassword = async (id, newPassword) => {
    exists(id, 'id');
    exists(newPassword, 'password');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid ID
    newPassword = notStringOrEmpty(newPassword, 'password');
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    // already set
    let plainTextPassword = user.oldPWs[-1]; // get last password added, that is most recent
    if (newPassword === plainTextPassword) throw `Error: Old passwords may not be reused.`
    let hash = pw.hashPassword(newPassword);
    let updatedPWList = user.oldPWs.push(newPassword); // add new password to end of old passwords list
    const updatedUser = { // update password and the password list
        hashedPW: hash,
        oldPWs: updatedPWList
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const registerRace = async (id, raceId) => {
    exists(id, 'id');
    exists(raceId, 'raceId');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid ID
    raceId = notStringOrEmpty(raceId, 'raceId');
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    // already in list??  --------------------------------

    // if not in list, add to list
    let regRaces = user.registeredRaces.push(raceId);
    const updatedUser = {
        registeredRaces: regRaces
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const addTrainingPlan = async (id, raceId) => {
    exists(id, 'id');
    exists(raceId, 'raceId');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid ID
    raceId = notStringOrEmpty(raceId, 'raceId');
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    // already in list??  --------------------------------

    // if not in list, add to list
    let trainPlans = user.trainingPlans.push(raceId);
    const updatedUser = {
        trainingPlans: trainPlans
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};


export { create, getAll, get, updateEmail, updateCity, updateState, updateGender, updateSocial, updateSystem, updatePassword, registerRace, addTrainingPlan };