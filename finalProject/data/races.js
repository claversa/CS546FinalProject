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

    const errors = [];


    try {
        raceName = help.notStringOrEmpty(raceName, "race name");
    } catch (e) {
        errors.push(`invalid race name`);
    }

    try {
        username = help.notStringOrEmpty(username, "username");
    } catch (e) {
        errors.push(`invalid username`);
    }

    try {
        raceCity = help.notStringOrEmpty(raceCity, "race city");
    } catch (e) {
        errors.push(`invalid race city`);
    }

    try {
        raceState = help.notStringOrEmpty(raceState, "race state");
        raceState = help.validState(raceState);
    } catch (e) {
        errors.push(`invalid race state`);
    }

    try {
        raceTime = help.notStringOrEmpty(raceTime, "race time");
        raceTime = help.validTime(raceTime);
    } catch (e) {
        errors.push(`invalid race time`);
    }

    let validTerrain = ["Street", "Grass", "Beach", "Rocky", "Inclined", "Muddy"];
    try {
        if (!Array.isArray(terrain) || terrain.size === 1) {
            console.log("2");

            terrain = [terrain];
            if (!(validTerrain.includes(terrain))) throw "Error: Invalid terrain";

        }
        else {
            terrain = help.arraysWithStringElem(terrain, "terrain");
            for (let ter of terrain) {
                console.log("3");

                if (!(validTerrain.includes(ter))) {
                    console.log("4");

                    throw "Error: Invalid terrain";
                }
            }
        }
    } catch (e) {
        errors.push(`invalid terrain 1`);
    }

    try {
        raceUrl = help.notStringOrEmpty(raceUrl, "race URL");
        help.validURL(raceUrl);
    } catch (e) {
        errors.push(`invalid race URL: must be of form https://www.{url}.{com,org,etc}`);
    }

    try {
        // Validate date
        help.validDate(raceDate);
        if (!help.isDateAfterToday(raceDate, raceTime)) throw "Error: Race date must be after today's date";
    } catch (e) {
        errors.push(`invalid race : must be valid format and after today's date and time`);
    }

    try {
        // Validate distance
        let validDist = ["5K", "Half Marathon", "Marathon"];
        if (!(validDist.includes(distance))) {
            throw "Error: Invalid distance";
        }
    } catch (e) {
        errors.push(`invalid distance`);
    }


    // Check for errors and handle accordingly
    if (errors.length > 0) {
        // console.log('Validation errors:', errors);
        throw (`Errors: ${errors}`);
    }

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
        registeredUsers: [],
        comments: [],
        reviews: []
    };

    const raceCollection = await races();
    const existRacename = await raceCollection.findOne({ raceName: raceName });
    if (existRacename) throw 'Race name taken';
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
            { raceName: { $regex: keyword, $options: 'i' } }
        ]
    }).toArray();
    return results;
};

export const searchByState = async (state) => {
    state = help.notStringOrEmpty(state, 'state');
    const raceCollection = await races();
    let results = await raceCollection.find({ raceState: state }).toArray();
    return results;
};

// update functions
export const updateName = async (id, newName) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    newName = help.notStringOrEmpty(newName, 'newName');
    if (newName.length > 200) throw 'The new name must be less than 200 characters';
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (newName === race.raceName) throw `Error: Race name is already ${race.raceName}`
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

export const updateCity = async (id, newCity) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    newCity = help.notStringOrEmpty(newCity, 'newCity');
    if (newCity.length > 57) throw 'The new city must be less than 57 characters';
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (newCity === race.raceCity) throw `Error: Race city is already ${race.raceCity}`
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

export const updateState = async (id, newState) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    newState = help.notStringOrEmpty(newState, 'newState');
    newState = help.validState(newState);
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (newState === race.raceState) throw `Error: Race state is already ${race.raceState}`
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

export const updateDate = async (id, newDate) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    newDate = help.notStringOrEmpty(newDate, 'newDate');
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (!help.isDateAfterToday(newDate, race.raceTime)) throw "Error: Race is not after today's current date and time."
    if (newDate === race.raceDate) throw `Error: Race date is already ${race.raceDate}`
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

export const updateTime = async (id, newTime) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    newTime = help.notStringOrEmpty(newTime, 'newTime');
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (!help.isDateAfterToday(race.raceDate, newTime)) throw "Error: Race is not after today's current date and time."
    if (newTime === race.raceTime) throw `Error: Race time is already ${race.raceTime}`
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

export const updateDistance = async (id, newDistance) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    newDistance = help.notStringOrEmpty(newDistance, 'newDistance');
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (newDistance === race.distance) throw `Error: Race distance is already ${race.distance}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { distance: newDistance } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update distance successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const updateTerrain = async (id, newTerrain) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
    if (newTerrain === race.raceTerrain) throw `Error: Race terrain is already ${race.raceTerrain}`
    const updatedInfo = await raceCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { terrain: newTerrain } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update terrain successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};

export const updateUrl = async (id, newUrl) => {
    id = help.notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    newUrl = help.notStringOrEmpty(newUrl, "new race url");
    help.validURL(newUrl);
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(id) });
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

export const addComment = async (username, raceId, comment) => {
    const raceCollection = await races();
    try {
        comment = help.notStringOrEmpty(comment, 'comment');
        if (comment.length > 200) {
            throw ('Comment must be less than 200 characters long');
        }
        const race = await raceCollection.findOne({ _id: new ObjectId(raceId) });
        if (!Array.isArray(race.comments)) {
            race.comments = [];
        }
        const newComment = { username, comment };
        if (race) {
            race.comments.push(newComment)
        }

        const updatedRace = {
            comments: race.comments
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
    } catch (error) {
        throw error;
    }
}

export const removeComment = async (username, raceId, comment) => {
    const raceCollection = await races();
    try {
        comment = help.notStringOrEmpty(comment, 'comment');
        const race = await raceCollection.findOne({ _id: new ObjectId(raceId) });

        const indexToRemove = race.comments.findIndex(item => item.username === username && item.comment === comment);
        if (indexToRemove !== -1) {
            race.comments.splice(indexToRemove, 1);
        }
        const updatedRace = {
            comments: race.comments
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
    } catch (error) {
        throw error;
    }
}

export const addReview = async (username, raceId, comment, rating) => {
    const raceCollection = await races();
    try {
        comment = help.notStringOrEmpty(comment, 'comment');
        if (comment.length > 200) {
            throw ('Review must be less than 200 characters long');
        }
        const race = await raceCollection.findOne({ _id: new ObjectId(raceId) });
        if (help.isDateAfterToday(race.raceDate, race.raceTime)) {
            throw ('You can only review after the Race Date')
        }
        if (!Array.isArray(race.reviews)) {
            race.reviews = [];
        }
        const newComment = { username, comment, rating };
        if (race) {
            race.reviews.push(newComment)
        }

        const updatedRace = {
            reviews: race.reviews
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
    } catch (error) {
        throw error;
    }
}

export const removeReview = async (username, raceId, comment, rating) => {
    const raceCollection = await races();
    try {
        comment = help.notStringOrEmpty(comment, 'comment');
        const race = await raceCollection.findOne({ _id: new ObjectId(raceId) });

        const indexToRemove = race.reviews.findIndex(item => item.username === username && item.comment === comment && item.rating === rating);
        if (indexToRemove !== -1) {
            race.reviews.splice(indexToRemove, 1);
        }
        const updatedRace = {
            reviews: race.reviews
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
    } catch (error) {
        throw error;
    }
}

export const deleteRace = async (raceId) => {
    const raceCollection = await races();
    try {
        const deletedRace = await raceCollection.deleteOne({ _id: new ObjectId(raceId) });

        if (deletedRace.deletedCount === 0) {
            throw 'Race not found or could not be deleted';
        }

        return { success: true, message: 'Race deleted successfully' };
    } catch (error) {
        throw error;
    }
}

export const isCompleted = async (raceId) => {
    const raceCollection = await races();
    const race = await raceCollection.findOne({ _id: new ObjectId(raceId) });
    if (help.isDateAfterToday(race.raceDate, race.raceTime)) {
        return undefined;
    } else {
        return race.raceName;
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