import { dbConnection } from './mongoConnections.js';

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

//TODO: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT
export const users = getCollectionFn('users');
export const plans = getCollectionFn('plans');
export const races = getCollectionFn('races');
export const reviews = getCollectionFn('reviews');

