import { users, races } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as help from "../helpers/helpers.js";
import * as pw from "../helpers/bcrypt.js";
import bcrypt from "bcryptjs";
import * as race from "./races.js";

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

    const errors = [];
    try {
        firstName = help.notStringOrEmpty(firstName, "firstName");
    } catch (e) {
        errors.push(`invalid firstName`);
    }

    try {
        lastName = help.notStringOrEmpty(lastName, "lastName");
    } catch (e) {
        errors.push(`invalid lastName`);
    }

    try {
        username = help.notStringOrEmpty(username, "username");
        username = help.validUsername(username);
    } catch (e) {
        errors.push(`invalid username: username must have between 2 and 10 characters`);
    }

    try {
        email = help.notStringOrEmpty(email, "email");
        email = help.validEmail(email);
    } catch (e) {
        errors.push(`invalid email`);
    }

    try {
        state = help.notStringOrEmpty(state, "state");
        state = help.validState(state);
    } catch (e) {
        errors.push(`invalid state`);
    }

    try {
        gender = help.notStringOrEmpty(gender, "gender");
        if (gender !== "male" && gender !== "female" && gender !== "other" && gender !== "preferNot") {
            errors.push('invalid gender response');
        }
    } catch (e) {
        errors.push(`invalid gender`);
    }

    try {
        socialPlatform = help.notStringOrEmpty(socialPlatform, "social platform");
        const validPlatforms = ["twitter", "facebook", "instagram"];
        if (!validPlatforms.includes(socialPlatform)) {
            errors.push('invalid social platform');
        }
    } catch (e) {
        errors.push(`invalid social platform`);
    }

    try {
        socialHandle = help.notStringOrEmpty(socialHandle, "social handle");
    } catch (e) {
        errors.push(`invalid social handle`);
    }

    try {
        system = help.notStringOrEmpty(system, "system");
        if (system !== "metric" && system !== "imperial") {
            errors.push('invalid measurement system');
        }
    } catch (e) {
        errors.push(`invalid system`);
    }

    try {
        password = help.notStringOrEmpty(password, "password");
        password = help.validPassword(password);
    } catch (e) {
        errors.push(`invalid password: password must have at least 8 characters with at least 1 uppercase letter, number, and special character`);
    }

    let age;
    try {
        birthdate = help.notStringOrEmpty(birthdate, "birthdate");
        help.validBirthdate(birthdate);
        age = help.calculateAge(birthdate);
        if (age < 13) {
            errors.push("Age must be above 13 to register");
        }
    } catch (e) {
        errors.push(`invalid birthdate`);
    }


    if (errors.length > 0) {
        // If there are errors, handle them accordingly
        // console.log('Errors found:', errors);
        throw (`Errors: ${errors}`);
    }


  //make empty arrays for registered races and training plans that will be filled in later
  let registeredRaces = [];
  let currPlan = [];
  let trainingPlans = {};

    let hashedPW = await pw.hashPassword(password);
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
        registeredRaces,
        currPlan,
        trainingPlans,
        private: false
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
    if (!userList) throw 'Could not get all users';
    userList = userList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return userList;
};

// get specific user
const get = async (username) => {
    username = help.notStringOrEmpty(username, 'username');
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (user === null) throw `No user named ${username}`;
    return user;
};


const updateSystem = async (username, system) => {
    username = help.notStringOrEmpty(username, 'username)');
    system = help.notStringOrEmpty(system, 'system');
    if (system != "imperial" && system != "metric") throw 'Error: not a valid system!'
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    if (user.system === system) throw "Error: same system as before"

    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { system: system } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    return updatedInfo;
};

const deleteProfile = async (username) => {
    const userCollection = await users();
    try {
        const deletedUser = await userCollection.deleteOne({ username: username });

        if (deletedUser.deletedCount === 0) {
            throw 'User not found or could not be deleted';
        }

        return { success: true, message: 'User deleted successfully' };
    } catch (error) {
        throw error;
    }
}

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
  username = help.notStringOrEmpty(username, "username");
  newEmail = help.notStringOrEmpty(newEmail, "new email");
  newEmail = help.validEmail(newEmail);
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user) throw "User not found"; // checks if user is not found
  const existEmail = await userCollection.findOne({ email: email });
  if (existEmail) throw "email already in use";
  // already set
  if (newEmail.toLowerCase() === user.email.toLowerCase())
    throw `Error: Email is already ${user.email}`;
  const updatedInfo = await userCollection.findOneAndUpdate(
    { username: username },
    { $set: { email: newEmail } },
    { returnDocument: "after" }
  );
  if (!updatedInfo) {
    throw "could not update user successfully";
  }
  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;
};

const updateState = async (username, newState) => {
  username = help.notStringOrEmpty(username, "username");
  newState = help.notStringOrEmpty(newState, "new state");
  newState = help.validState(newState);
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user) throw "User not found"; // checks if user is not found
  // already set
  if (newState.toLowerCase() === user.state.toLowerCase())
    throw `Error: State is already ${user.state}`;
  const updatedInfo = await userCollection.findOneAndUpdate(
    { username: username },
    { $set: { state: newState } },
    { returnDocument: "after" }
  );
  if (!updatedInfo) {
    throw "could not update user successfully";
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
    if (!user) throw 'User not found' 
    if (newGender === user.gender) throw `Error: Gender is already ${user.gender}`
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

const updatePrivacy = async (username, newPrivacy) => {
    username = help.notStringOrEmpty(username, 'username');
    newPrivacy = help.notStringOrEmpty(newPrivacy, 'new privacy');
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    if (newPrivacy !== "true" && newPrivacy !== "false") throw 'Error: not a valid privacy!'
    if (newPrivacy === user.privacy) throw `Error: privacy is already ${user.private}`
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { private: newPrivacy } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updatePlatform = async (username, newPlatform) => {
    username = help.notStringOrEmpty(username, 'username');
    newPlatform = help.notStringOrEmpty(newPlatform, 'new platform');
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    if (newPlatform != "instagram" && newPlatform != "facebook" && newPlatform != "twitter") throw 'Error: not a valid platform!'
    if (newPlatform.toLowerCase() === user.socialPlatform.toLowerCase()) throw `Error: Social is already ${user.socialPlatform}`
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { socialPlatform: newPlatform } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updateHandle = async (username, newHandle) => {
    username = help.notStringOrEmpty(username, 'username');
    newHandle = help.notStringOrEmpty(newHandle, 'new handle');
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    if (newHandle.toLowerCase() === user.socialHandle.toLowerCase()) throw `Error: Social is already ${user.socialPlatform}`
    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { socialHandle: newHandle } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

const updatePassword = async (username, newPassword) => {
  username = help.notStringOrEmpty(username, "username");
  newPassword = help.notStringOrEmpty(newPassword, "new password");
  newPassword = help.validPassword(newPassword);
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user) throw "User not found"; // checks if user is not found
  // already set
  let unhashedPassword = await bcrypt.compare(newPassword, user.hashedPW);
  if (unhashedPassword) throw `Error: Old passwords may not be reused.`;
  let hash = await pw.hashPassword(newPassword);
  const updatedInfo = await userCollection.findOneAndUpdate(
    { username: username },
    { $set: { hashedPW: hash } },
    { returnDocument: "after" }
  );
  if (!updatedInfo) {
    throw "could not update user successfully";
  }
  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;
};

const registerRace = async (username, raceId) => {
  username = help.notStringOrEmpty(username, "username");
  if (!ObjectId.isValid(raceId)) throw "invalid object ID"; // check for valid ID
  raceId = help.notStringOrEmpty(raceId, "raceId");
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!Array.isArray(user.registeredRaces)) {
    user.registeredRaces = [];
  }
  user.registeredRaces.push(raceId);
  const updatedUser = {
    registeredRaces: user.registeredRaces,
  };
  const updatedInfo = await userCollection.findOneAndUpdate(
    { username: username },
    { $set: updatedUser },
    { returnDocument: "after" }
  );
  if (!updatedInfo) {
    throw "could not update user successfully";
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

  user.registeredRaces = user.registeredRaces.filter((id) => id !== raceId);
  const updatedUser = {
    registeredRaces: user.registeredRaces,
  };
  const updatedInfo = await userCollection.findOneAndUpdate(
    { username: username },
    { $set: updatedUser },
    { returnDocument: "after" }
  );
  if (!updatedInfo) {
    throw "could not update user successfully";
  }
  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;
};

const addTrainingPlan = async (username, raceId, maxMileageYet) => {
    username = help.notStringOrEmpty(username, 'username');
    if (!ObjectId.isValid(raceId)) throw 'invalid object ID';
    raceId = help.notStringOrEmpty(raceId, 'raceId');

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found
    // user.registeredRaces = user.registeredRaces.filter(id => id !== raceId);
    if (!maxMileageYet) {
        maxMileageYet = 0
    } else {
        maxMileageYet = help.isValidNumber(maxMileageYet, 'max mileage yet');
    }

    const {
        raceName,
        raceCreator,
        raceCity,
        raceState,
        raceDate,
        raceTime,
        distance,
        terrain,
        raceUrl,
        registeredUsers
    } = await race.get(raceId);

    // 4 weeks
    let base5k = [[0, 1, 1, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 2.5], [0, 2, 2, 1, 0, 2, 3.1]];
    // 12 weeks
    let baseHalf = [[0, 1, 1, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 3], [0, 3, 2, 3, 0, 1, 4], [0, 3.5, 2, 3.5, 0, 1, 5], [0, 3.5, 2, 3.5, 0, 1, 5], [0, 4, 2, 4, 0, 1, 6],
    [0, 4, 2, 4, 1, 0, 3.1], [0, 4.5, 3, 4.5, 0, 1, 7], [0, 4.5, 3, 4.5, 0, 1, 8], [0, 5, 3, 5, 0, 1, 9], [0, 5, 3, 5, 0, 1, 10], [0, 4, 3, 2, 0, 0, 13.1]];
    // 18 weeks
    let baseMarathon = [[0, 1, 1, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 3], [0, 3, 2, 3, 0, 1, 4], [0, 3.5, 2, 3.5, 0, 1, 5], [0, 4.5, 3, 4.5, 0, 1, 7], [0, 5, 3, 5, 0, 1, 9], [0, 5, 3, 5, 3, 0, 10], [0, 4, 3, 2, 4, 0, 13.2],
    [0, 3, 7, 4, 6, 0, 10], [0, 3, 7, 4, 0, 3, 15], [0, 4, 8, 5, 0, 3, 16], [0, 4, 8, 5, 0, 3, 12], [0, 4, 9, 5, 0, 3, 18], [0, 5, 9, 5, 0, 3, 14], [0, 5, 10, 5, 0, 4, 20], [0, 5, 8, 4, 0, 3, 12], [0, 4, 6, 3, 0, 1, 8], [0, 3, 4, 2, 0, 1, 26.2]];
    // what was users last greatest mileage, compare FROM START TO END of above training arrays 
    let plan = [];
    switch (distance) {
        case "5K":
            plan = base5k;
            break;
        case "Half Marathon":
            plan = baseHalf;
            break;
        case "Marathon":
            plan = baseMarathon;
            break;
        default:
            throw `Not a valid distance`;
    }

    if (maxMileageYet >= plan[1][6]) {
        for (let i = 0; i < plan.length; i++) {
            if (maxMileageYet <= plan[i][6]) {
                plan = plan.slice(i, plan.length);
                break;
            } else if (i === plan.length - 1) {
                plan = plan.slice(i, plan.length);
            }
        }
    }

    let weeksUntil = Math.floor((new Date(raceDate) - Date.now()) / 1000 / 60 / 60 / 24 / 7);
    let errorMsg = "";

    if (weeksUntil <= 0) {
        plan = [];
        errorMsg = `This race data already passed.`;
    } else if (weeksUntil < plan.length) {
        plan = plan.slice(0, weeksUntil);
        errorMsg = `You can not safely train for the entire ${distance} mile race. Train up until ${plan[plan.length - 1][6]} miles and then you have to walk.`;
    } else {
        let div = Math.floor((weeksUntil - plan.length) / plan.length);
        let mod = weeksUntil % plan.length;
        if (plan.length === 1) {
            plan = Array(weeksUntil).fill(plan[0]);
        } else {
            plan = plan.map((week, ind) => {
                if (ind === plan.length - 1) {
                    return Array(week);
                } else if (plan.length - mod - 1 <= ind) {
                    return Array(2 + div).fill(week);
                } else {
                    return Array(1 + div).fill(week);
                }
            }).flat();
        }
    }

    let plans = user.trainingPlans;
    plans[`${raceId}`] = plan;
    if (Object.keys(plans).length === 0) {
        plan = [];
    } else if (Object.keys(plans).length === 1) {
        plan = Object.values(plans)[0];
    } else {
        plan = [0, [[0, 0, 0, 0, 0, 0, 0]]];
        for (const [key, val] of Object.entries(plans)) {
            if (plan[1].join() === [[0, 0, 0, 0, 0, 0, 0]].join()) {
                plan = [key, val];
            } else {
                let r1 = await race.get(key);
                let r2 = await race.get(plan[0]);

                if (val[val.length - 1][6].mile === plan[1][plan[1].length - 1][6].mile) {
                    plan = r1.raceDate < r2.raceDate ? [key, val] : plan;
                } else {z
                    plan = val[val.length - 1][6].mile > plan[1][plan[1].length - 1][6].mile ? [key, val] : plan;
                }
            }
        }
        plan = plan[1];
    }

    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        {
            $set: {
                currPlan: plan,
                trainingPlans: plans
            }
        },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    return updatedInfo;
};

const removeTrainingPlan = async (username, raceId) => {
    username = help.notStringOrEmpty(username, 'username');
    if (!ObjectId.isValid(raceId)) throw 'invalid object ID';
    raceId = help.notStringOrEmpty(raceId, 'raceId');

  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user) throw "User not found"; // checks if user is not found

    let plan;
    let plans = user.trainingPlans;
    delete plans[`${raceId}`];
    if (Object.keys(plans).length === 0) {
        plan = [];
    } else if (Object.keys(plans).length === 1) {
        plan = Object.values(plans)[0];
    } else {
        plan = [0, [[0, 0, 0, 0, 0, 0, 0]]];
        for (const [key, val] of Object.entries(plans)) {
            if (plan[1].join() === [[0, 0, 0, 0, 0, 0, 0]].join()) {
                plan = [key, val];
            } else {
                let r1 = await race.get(key);
                let r2 = await race.get(plan[0]);

        if (
          val[val.length - 1][6].mile === plan[1][plan[1].length - 1][6].mile
        ) {
          plan = r1.raceDate < r2.raceDate ? [key, val] : plan;
        } else {
          plan = val[val.length - 1][6].mile > plan[1][plan[1].length - 1][6].mile ? [key, val] : plan;
        }
      }
    }
    plan = plan[1];
  }

    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        {
            $set: {
                currPlan: plan,
                trainingPlans: plans
            }
        },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    return updatedInfo;
};

const updateTrainingTimes = async (username, plan) => {
  username = help.notStringOrEmpty(username, "username");
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user) throw "User not found"; // checks if user is not found
  for (let week of plan) {
    if (week.length !== 7) {
      throw "invalid week";
    }
    for (let day of week) {
      if (typeof day !== "object") {
        throw "not an object";
      }
      if (typeof day.mile !== "number" || isNaN(day.mile)) {
        throw "not a number";
      }
      if (day.time !== null && (typeof day.time !== "string" || !/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)?$/.test(day.time))) {
        throw "not a valid time";
      }
    }
  }

  const updatedInfo = await userCollection.findOneAndUpdate(
    { username: username },
    {
      $set: {
        currPlan: plan,
      },
    },
    { returnDocument: "after" }
  );
  if (!updatedInfo) {
    throw "could not update user successfully";
  }
  return updatedInfo;
};

const check = async (username, password) => {
  username = help.notStringOrEmpty(username, "username");
  password = help.notStringOrEmpty(password, "password");
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
};

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
      { returnDocument: "after" }
    );
    if (!updatedInfo) {
      throw "could not update user successfully";
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
  } catch (error) {
    throw error;
  }
};

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

export const checkUser = async (username, path) => {
    try {
        const pathArray = path.split('/');
        const raceId = pathArray[pathArray.length - 1];
        const raceCollection = await races();
        const race = await raceCollection.findOne({ _id: new ObjectId(raceId) });
        if (race.username === username) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
}

export { deleteProfile, updateTrainingTimes, create, getAll, get, updateEmail, updateState, updatePrivacy, updateGender, updatePlatform, updateHandle, updateSystem, updatePassword, registerRace, unregisterRace, addTrainingPlan, removeTrainingPlan, check };