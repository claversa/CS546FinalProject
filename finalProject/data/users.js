import { users, races } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import * as help from '../helpers/helpers.js';
import * as pw from '../helpers/bcrypt.js'
import bcrypt from 'bcryptjs';


// create new user
const create = async (
    firstName,
    lastName,
    username,
    email,
    state,
    gender,
    birthdate,
    socialPlatform,
    socialHandle,
    system,
    password
) => {
    // exists, not string or empty, trims all input as well
    username = help.notStringOrEmpty(username, "username");
    firstName = help.notStringOrEmpty(firstName, "firstName");
    lastName = help.notStringOrEmpty(lastName, "lastName");
    email = help.notStringOrEmpty(email, "email");
    state = help.notStringOrEmpty(state, "state");
    gender = help.notStringOrEmpty(gender, "gender");
    socialPlatform = help.notStringOrEmpty(socialPlatform, "social platform");
    socialHandle = help.notStringOrEmpty(socialHandle, "social handle");
    system = help.notStringOrEmpty(system, "system");
    password = help.notStringOrEmpty(password, "password");
    birthdate = help.notStringOrEmpty(birthdate, "birthdate");

    if (gender != "male" && gender != "female" && gender != "other" && gender != "preferNot") throw 'Error: not a valid response (gender)!'
    if (system != "metric" && system != "imperial") throw "Error: invalid measurement system";

    // validate birthdate
    try {
        help.validBirthdate(birthdate);
    } catch (e) {
        throw e;
    };

    // validate username and PW
    username = help.validUsername(username);
    password = help.validPassword(password);

    // validate abbrev and makes uppercase
    state = help.validState(state);

    // validate email -- NO DUPLICATES EVEN WITH CAPS
    email = help.validEmail(email);

    // password
    let hashedPW = await pw.hashPassword(password);
    let age = help.calculateAge(birthdate);
    if (age < 13) throw "Age must be above 13 to register"

    //make empty arrays for registered races and training plans that will be filled in later
    let registeredRaces = [];
    let trainingPlans = [];

    let newUser = {
        firstName,
        lastName,
        username,
        email,
        state,
        gender,
        age,
        socialPlatform,
        socialHandle,
        system,
        hashedPW,
        registeredRaces:[],
        reviews: [],
        trainingPlans,
    };
    const userCollection = await users();
    const existUsername = await userCollection.findOne({ username: username });
    if (existUsername) throw 'username taken';
    const existEmail = await userCollection.findOne({ email: email });
    if (existEmail) throw 'email already in use';
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';
    const user = await get(username);
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
const get = async (username) => {
    username = help.notStringOrEmpty(username, 'username');
    //if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (user === null) throw `No user named ${username}`;
    return user;
};


const updateSystem = async (username) => {
    username = help.notStringOrEmpty(username, 'username)');
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    let newSystem = (user.system === 'metric') ? 'imperial' : 'metric'; // swap system val

    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { system: newSystem } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    return updatedInfo;
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
// cant update name, username, birthdate
const updateEmail = async (username, newEmail) => {
    username = help.notStringOrEmpty(username, 'username');
    newEmail = help.notStringOrEmpty(newEmail, 'new email');
    newEmail = help.validEmail(newEmail);
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    const existEmail = await userCollection.findOne({ email: email });
    if (existEmail) throw 'email already in use';
    // already set
    if (newEmail.toLowerCase() === user.email.toLowerCase()) throw `Error: Email is already ${user.email}`
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { email: newEmail } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updateState = async (username, newState) => {
    username = help.notStringOrEmpty(username, 'username');
    newState = help.notStringOrEmpty(newState, 'new state');
    newState = help.validState(newState);
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    // already set
    if (newState.toLowerCase() === user.state.toLowerCase()) throw `Error: State is already ${user.state}`
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { state: newState } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updateGender = async (username, newGender) => {
    username = help.notStringOrEmpty(username, 'username');
    newGender = help.notStringOrEmpty(newGender, 'new gender');
    if (newGender != "male" && newGender != "female" && newGender != "other" && newGender != "preferNot") throw 'Error: not a valid response (gender)!'
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    // already set
    if (newGender.toLowerCase() === user.gender.toLowerCase()) throw `Error: Gender is already ${user.gender}`
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { gender: newGender } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updateSocial = async (username, newSocial) => {
    username = help.notStringOrEmpty(username, 'username');
    newSocial = help.notStringOrEmpty(newSocial, 'new social');
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    // already set
    if (newSocial.toLowerCase() === user.social.toLowerCase()) throw `Error: Social is already ${user.social}`
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { social: newSocial } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updatePassword = async (username, newPassword) => {
    username = help.notStringOrEmpty(username, 'username');
    newPassword = help.notStringOrEmpty(newPassword, 'new password');
    newPassword = help.validPassword(newPassword);
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    // already set
    let unhashedPassword = await bcrypt.compare(newPassword, user.hashedPW)
    if (unhashedPassword) throw `Error: Old passwords may not be reused.`
    let hash = await pw.hashPassword(newPassword);
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { hashedPW: hash } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const registerRace = async (username, raceId) => {
    username = help.notStringOrEmpty(username, 'username');
    if (!ObjectId.isValid(raceId)) throw 'invalid object ID'; // check for valid ID
    raceId = help.notStringOrEmpty(raceId, 'raceId');
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!Array.isArray(user.registeredRaces)) {
        user.registeredRaces = [];
    }
    user.registeredRaces.push(raceId);
    const updatedUser = {
        registeredRaces: user.registeredRaces
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: updatedUser },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const unregisterRace = async (username, raceId) => {
    username = help.notStringOrEmpty(username, 'username');
    if (!ObjectId.isValid(raceId)) throw 'invalid object ID'; 
    raceId = help.notStringOrEmpty(raceId, 'raceId');
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!Array.isArray(user.registeredRaces)) {
        user.registeredRaces = [];
    }

    user.registeredRaces = user.registeredRaces.filter(id => id !== raceId);
    const updatedUser = {
        registeredRaces: user.registeredRaces
    };
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
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

const check = async (username, password) => {
    username = help.notStringOrEmpty(username, 'username');
    password = help.notStringOrEmpty(password, 'password');
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) {
        return null;
    }
    let correctPassword = await pw.checkPassword(password, user.hashedPW);
    if (correctPassword) {
        return user;
    }
    return null;
}

export const addReview = async (username, raceId, comment, rating) => {
    const userCollection = await users();
    try {
        comment = help.notStringOrEmpty(comment, 'comment');
        if (comment.length > 200) {
            throw ('Review must be less than 200 characters long');
        }
        const user = await userCollection.findOne({ username: username });
        if (!Array.isArray(user.reviews)) {
            user.reviews = [];
        }
        const raceCollection = await races();
        const race = await raceCollection.findOne({ _id: new ObjectId(raceId) });
        const raceName = race.raceName
        const newComment = { username, raceName, raceId, comment, rating };
        if (user) {
            user.reviews.push(newComment)
        }       
        
        const updatedUser = {
            reviews: user.reviews
        };

        const updatedInfo = await userCollection.findOneAndUpdate(
            { username: username },
            { $set: updatedUser },
            { returnDocument: 'after' }
        );
        if (!updatedInfo) {
            throw 'could not update user successfully';
        }
        updatedInfo._id = updatedInfo._id.toString();
        return updatedInfo;
    } catch (error) {
        throw error;
    }
}

export const removeReview = async (username, raceId, comment, rating) => {
    const userCollection = await users();
    try {
        comment = help.notStringOrEmpty(comment, 'comment');
        const user = await userCollection.findOne({ username: username });
    
        const indexToRemove = user.reviews.findIndex(item => item.username === username && item.comment === comment && item.rating === rating && item.raceId === raceId);
        if (indexToRemove !== -1) {
        user.reviews.splice(indexToRemove, 1);
        }
        const updatedUser = {
            reviews: user.reviews
        };

        const updatedInfo = await userCollection.findOneAndUpdate(
            { username: username },
            { $set: updatedUser },
            { returnDocument: 'after' }
        );
        if (!updatedInfo) {
            throw 'could not update race successfully';
        }
        updatedInfo._id = updatedInfo._id.toString();
        return updatedInfo;
    } catch (error) {
        throw error;
    }
}

export { create, getAll, get, updateEmail, updateState, updateGender, updateSocial, updateSystem, updatePassword, registerRace, unregisterRace, addTrainingPlan, check };

// create("jasper", "tumbokon", "jaspert", "jasperjay0628@gmail.com", "NJ", "male", "06/28/2003", "twitter", "jsprjay", "metric", "YourMom2$")
//     .then((result) => {
//         // This function will execute when the promise is resolved
//         console.log(result); // Print the resolved value
//     })
//     .catch((error) => {
//         // This function will execute if the promise is rejected
//         console.error("Error occurred:", error);
//     });

// updateGender('jaspert', 'female')
// .then((result) => {
//         // This function will execute when the promise is resolved
//         console.log(result); // Print the resolved value
//     })
//     .catch((error) => {
//         // This function will execute if the promise is rejected
//         console.error("Error occurred:", error);
//     });