import { users } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import * as help from '../helpers/helpers.js';

const create = async (
    username,
    raceName,
    raceDate,
    distance,
    maxMileageYet, // user will click "register", all above params will populate automatically but they will answer a popup about latest mileage
) => {
    // validation
    username = help.notStringOrEmpty(username, 'username');
    raceName = help.notStringOrEmpty(raceName, "race name");
    raceDate = help.notStringOrEmpty(raceDate, "race date");
    distance = help.notStringOrEmpty(distance, "distance");
    maxMileageYet = help.notStringOrEmpty(maxMileageYet, "max mileage yet");

    try {
        help.validDate(raceDate);
    } catch (e) {
        throw e;
    };
    
    // 4 weeks
    let base5k = [[0, 1, 1, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 2.5], [0, 2, 2, 1, 0, 2, 3.1]];
    // 12 weeks
    let baseHalf = [[0, 1, 1, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 3], [0, 3, 2, 3, 0, 1, 4], [0, 3.5, 2, 3.5, 0, 1, 5], [0, 3.5, 2, 3.5, 0, 1, 5], [0, 4, 2, 4, 0, 1, 6], 
    [0, 4, 2, 4, 1, 0, 3.1], [0, 4.5, 3, 4.5, 0, 1, 7], [0, 4.5, 3, 4.5, 0, 1, 8], [0, 5, 3, 5, 0, 1, 9], [0, 5, 3, 5, 0, 1, 10], [0, 4, 3, 2, 0, 0, 13.1]];
    // 18 weeks
    let baseMarathon = [[0, 1, 1, 1, 0, 1, 2], [0, 1, 2, 1, 0, 1, 3], [0, 3, 2, 3, 0, 1, 4], [0, 3.5, 2, 3.5, 0, 1, 5], [0, 4.5, 3, 4.5, 0, 1, 7], [0, 5, 3, 5, 0, 1, 9], [0, 5, 3, 5, 3, 0, 10], [0, 4, 3, 2, 4, 0, 13.2], 
    [0, 3, 7, 4, 6, 0, 10], [0, 3, 7, 4, 0, 3, 15], [0, 4, 8, 5, 0, 3, 16], [0, 4, 8, 5, 0, 3, 12], [0, 4, 9, 5, 0, 3, 18], [0, 5, 9, 5, 0, 3, 14], [0, 5, 10, 5, 0, 4, 20], [0, 5, 8, 4, 0, 3, 12], [0, 4, 6, 3, 0, 1, 8],[0, 3, 4, 2, 0, 1, 26.2]]
    // what was users last greatest mileage, compare FROM START TO END of above training arrays 
    let plan = [];
    switch (distance) {
        case 3.1: 
            plan = base5k;
            break;
        case 13.2: 
            plan = baseHalf;
            break;
        case 26.2: 
            plan = baseMarathon;
            break;
        default: 
            throw `Not a valid distance`;
    }

    if(maxMileageYet >= plan[1][6]){
        for (let i = 1; i < plan.length; i++){
            if(i === (plan.length - 1)){
                plan = [plan[plan.length - 1]];
                break;
            } else if(maxMileageYet <= plan[i][6]){
                plan = plan.slice(i, plan.length);
                break;
            }
        }
    }

    let weeksUntil = Math.floor((Date.now() - new Date(raceDate))/1000/60/60/24/7);

    if (weeksUntil < plan.length){
        plan = plan.slice(0, weeksUntil);
        let errorMsg = `You can not safely train for the entire ${distance} mile race. Train up until ${plan[plan.length-1][6]} miles and then you have to walk.`;
    } else {
        let div = Math.floor((weeksUntil - plan.length) / plan.length);
        let mod = weeksUntil % plan.length;
        if (plan.length === 1){
            plan = Array(weeksUntil).fill(plan[0]);
        } else{
            plan = plan.map((week, ind) => {
                if(ind === plan.length - 1){
                    return Array(week);
                } else if (plan.length - mod - 1 <= ind){
                    return Array(2 + div).fill(week);
                } else{
                    return Array(1 + div).fill(week);
                }
            }).flat();
        }
    }

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found' // checks if user is not found

    const updatedInfo = await userCollection.findOneAndUpdate(
        { username: username },
        { $set: { trainingPlans: plan } },
        { returnDocument: 'after' }
    );
    if (!updatedInfo) {
        throw 'could not update user successfully';
    }
    return updatedInfo;
};

const update = async () => {

};

const getAll = async () => { // when comparing what to display, get all of a single user's training plans
    const planCollection = await plans();
    let planList = await planCollection.find({}).toArray(); // get all products, put in array
    if (!planList) throw 'Could not get all plans';
    planList = planList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return planList;
};

const get = async (id) => {
    let x = new ObjectId();
    exists(id, 'id');
    id = notStringOrEmpty(id, 'id');
    if (!ObjectId.isValid(id)) throw 'invalid object ID'; // check for valid id
    const planCollection = await plans();
    const plan = await planCollection.findOne({ _id: new ObjectId(id) });
    if (plan === null) throw 'No product with that id';
    plan._id = plan._id.toString();
    return plan;
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