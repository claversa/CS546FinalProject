import { races, users } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import * as help from '../helpers/helpers.js';


export const create = async (
    raceName, // string
    username, // string
    raceCity, // string
    raceState, // string
    raceDate, // string
    raceTime, // string
    distance, // number
    terrain, // array
    raceUrl // string
) => {
    //SPLIT UP
    if (typeof terrain === 'string') {
        terrain = [terrain]
    }
    raceName = help.notStringOrEmpty(raceName, "race name");
    username = help.notStringOrEmpty(username, "username");
    raceCity = help.notStringOrEmpty(raceCity, "raceCity");
    raceState = help.notStringOrEmpty(raceState, "raceState");
    raceTime = help.notStringOrEmpty(raceTime, "raceTime");
    terrain = help.arraysWithStringElem(terrain, "terrain");
    raceUrl = help.notStringOrEmpty(raceUrl, "raceUrl");

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'Error: User not found';

    // validate url
    help.validURL(raceUrl)

    // date
    help.validDate(raceDate)

    if (!help.isDateAfterToday(raceDate)) throw "Error: Race date must be after today's date"
    
    // state 
    raceState = help.validState(raceState); // to upper case
    
    // time
    raceTime = help.validTime(raceTime);


    //make new race to be inserted
    let newRace = { 
        raceName,
        username, 
        raceCity, 
        raceState, 
        raceDate, 
        raceTime, 
        distance, 
        terrain, 
        raceUrl,
        registeredUsers: []
    };
    const raceCollection = await races();
    const insertInfo = await raceCollection.insertOne(newRace);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add race';
    const newId = insertInfo.insertedId.toString();
    const race = await get(newId);
    return race;
};

export const getAll = async () => { // returns all races
    const raceCollection = await races();
    let raceList = await raceCollection.find({}).toArray(); // get all products, put in array
    if (!raceList) throw 'Could not get all races';
    raceList = raceList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return raceList;
};

export const get = async (id) => { // gets race by raceId
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (race === null) throw 'No product with that id';
    race._id = race._id.toString();
    return race;
};

export const search = async (keyword) => { // finds races based on keyword in raceName
    keyword = help.notStringOrEmpty(keyword);
    const raceCollection = await races();
    let results = await raceCollection.find({
        $or: [
            {raceName: { $regex: keyword, $options: 'i' } }
        ]
    }).toArray();
    return results;
};

// update functions
export const updateName = async (id, userId, newName) => { 
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    userId = help.notStringOrEmpty(userId, 'userId');
    if (!ObjectId.isValid(userId)) throw 'invalid user ID'; // check for valid user id
    newName = help.notStringOrEmpty(newName, "new race name");
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (userId !== races.userId) throw "Error: you must be the creator of this race to edit."
    if (newName.toLowerCase() === race.raceName.toLowerCase()) throw `Error: Race name is already ${race.raceName}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { raceName: newName } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update name successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const updateCity = async (id, userId, newCity) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    userId = help.notStringOrEmpty(userId, 'userId');
    if (!ObjectId.isValid(userId)) throw 'invalid user ID'; // check for valid user id
    newCity = help.notStringOrEmpty(newCity, "new race city");
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (userId !== races.userId) throw "Error: you must be the creator of this race to edit."
    if (newCity.toLowerCase() === race.raceCity.toLowerCase()) throw `Error: Race city is already ${race.raceCity}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { raceCity: newCity } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update city successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const updateState = async (id, userId, newState) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    userId = help.notStringOrEmpty(userId, 'userId');
    if (!ObjectId.isValid(userId)) throw 'invalid user ID'; // check for valid user id
    newState = help.notStringOrEmpty(newState, "new race state");
    newState = help.validState(newState); // to upper case
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (userId !== races.userId) throw "Error: you must be the creator of this race to edit."
    if (newState.toLowerCase() === race.raceState.toLowerCase()) throw `Error: Race state is already ${race.raceState}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { raceState: newState } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update state successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const updateDate = async (id, userId, newDate) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    userId = help.notStringOrEmpty(userId, 'userId');
    if (!ObjectId.isValid(userId)) throw 'invalid user ID'; // check for valid user id
    newDate = help.notStringOrEmpty(newDate, "new race date");
    help.validDate(newDate);
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (userId !== races.userId) throw "Error: you must be the creator of this race to edit."
    if (newDate.toLowerCase() === race.raceDate.toLowerCase()) throw `Error: Race date is already ${race.raceDate}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { raceDate: newDate } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update date successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const updateTime = async (id, userId, newTime) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    userId = help.notStringOrEmpty(userId, 'userId');
    if (!ObjectId.isValid(userId)) throw 'invalid user ID'; // check for valid user id
    newTime = help.notStringOrEmpty(newTime, "new race time");
    newTime = help.validTime(newTime);
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (userId !== races.userId) throw "Error: you must be the creator of this race to edit."
    if (newTime.toLowerCase() === race.distance.toLowerCase()) throw `Error: Race time is already ${race.distance}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { raceTime: newTime } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update time successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const updateDistance = async (id, userId, newDistance) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    userId = help.notStringOrEmpty(userId, 'userId');
    if (!ObjectId.isValid(userId)) throw 'invalid user ID'; // check for valid user id
    if (typeof newDistance !== 'number' || Number.isNaN(newDistance) || newDistance < 0) throw "Error: Distance must be a number"
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (userId !== races.userId) throw "Error: you must be the creator of this race to edit."
    if (newDistance === race.distance) throw `Error: Race distance is already ${race.distance}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { distance: newDistance } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const updateTerrain = async (id, userId, newTerrain) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    userId = help.notStringOrEmpty(userId, 'userId');
    if (!ObjectId.isValid(userId)) throw 'invalid user ID'; // check for valid user id
    newTerrain = help.arraysWithStringElem(newTerrain, "new race terrain");
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (userId !== races.userId) throw "Error: you must be the creator of this race to edit."
    if (newTerrain === race.terrain) throw `Error: Race terrain is already ${race.terrain}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { terrain: newTerrain } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const updateUrl = async (id, userId, newUrl) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    userId = help.notStringOrEmpty(userId, 'userId');
    if (!ObjectId.isValid(userId)) throw 'invalid user ID'; // check for valid user id
    newUrl = help.notStringOrEmpty(newUrl, "new race url");
    help.validURL(newUrl);
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (userId !== races.userId) throw "Error: you must be the creator of this race to edit."
    if (newUrl.toLowerCase() === race.raceUrl.toLowerCase()) throw `Error: Race name is already ${race.raceUrl}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { raceUrl: newUrl } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const registerUser = async (username, raceId) => {
    username = help.notStringOrEmpty(username, 'username');
    if (!ObjectId.isValid(raceId)) throw 'invalid object ID'; // check for valid ID
    raceId = help.notStringOrEmpty(raceId, 'raceId');
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(raceId) });
    if (!Array.isArray(race.registeredUsers)) {
        race.registeredUsers = [];
    }
    if (race.registeredUsers.includes(username)) {
        throw 'You are already registered';
    }
    race.registeredUsers.push(username);
    const updatedRace = {
        registeredUsers: race.registeredUsers 
    };
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(raceId) },
        { $set: updatedRace },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update race successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const unregisterUser = async (username, raceId) => {
    username = help.notStringOrEmpty(username, 'username');
    if (!ObjectId.isValid(raceId)) throw 'invalid object ID'; 
    raceId = help.notStringOrEmpty(raceId, 'raceId');
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(raceId) });
    if (!Array.isArray(race.registeredUsers)) {
        race.registeredUsers = [];
    }
    
    race.registeredUsers = race.registeredUsers.filter(name => name !== username);
    const updatedRace = {
        registeredUsers: race.registeredUsers
    };
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(raceId) },
        { $set: updatedRace },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update race successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const getRaceNamesByIds = async (raceIds) => {
    const racesCollection = await races();
    const raceNames = [];
    try {
        for (const raceId of raceIds) {
            const race = await racesCollection.findOne({ _id: new ObjectId(raceId) }, { projection: { raceName: 1 } });
            if (race) {
                race._id = race._id.toString();
                raceNames.push({ id: race._id, name: race.raceName });
            }
        }
        return raceNames;
    } catch (error) {
        throw error;
    }
}

// create("ur dadadadadad", "6621885fabed8ccf023bea58", "New York", "NY", "01/20/2024", "15:30", 100, ["rocky"], "www.apple.com")
//     .then((result) => {
//         // This function will execute when the promise is resolved
//         console.log(result); // Print the resolved value
//     })
//     .catch((error) => {
//         // This function will execute if the promise is rejected
//         console.error("Error occurred:", error);
//     });

// updateDistance('663452fbbc795a9b3e203939', 1)
// .then((result) => {
//     // This function will execute when the promise is resolved
//     console.log(result); // Print the resolved value
// })
// .catch((error) => {
//     // This function will execute if the promise is rejected
//     console.error("Error occurred:", error);
// });