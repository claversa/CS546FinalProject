// Import the create function from your data file
import * as raceData from './data/races.js';
import * as userData from './data/users.js';


// create 3 users caroline, tysaito, deanfil
const seedUsers = async () => {
    try {
        // Array of user data to seed
        const users = [
            {
                firstName: 'Ty',
                lastName: 'Saito',
                username: 'tysaito',
                email: 'tysaito@example.com',
                state: 'CA',
                gender: 'male',
                birthdate: '2002-05-01',
                socialPlatform: 'instagram',
                socialHandle: '@tysaito',
                system: 'imperial',
                password: 'Test123!',
            },
            {
                firstName: 'Caroline',
                lastName: 'LaVersa',
                username: 'caroline',
                email: 'caroline@example.com',
                state: 'NY',
                gender: 'female',
                birthdate: '1992-06-15',
                socialPlatform: 'twitter',
                socialHandle: '@carolinel',
                system: 'metric',
                password: 'Test123!',
            },
            {
                firstName: 'Dean',
                lastName: 'Filippone',
                username: 'deanfil',
                email: 'deanfil@example.com',
                state: 'TX',
                gender: 'male',
                birthdate: '1999-10-30',
                socialPlatform: 'facebook',
                socialHandle: '@dean.fil',
                system: 'imperial',
                password: 'Test123!',
            },
        ];

        // Loop through the user data and create each user in the database
        for (const user of users) {
            const createdUser = await userData.create(
                user.firstName,
                user.lastName,
                user.username,
                user.email,
                user.state,
                user.gender,
                user.birthdate,
                user.socialPlatform,
                user.socialHandle,
                user.system,
                user.password
            );
            console.log(`User created: ${user.username}`);
        }

        console.log('Successfully seeded the database with 3 users.');
    } catch (error) {
        console.error('Error seeding the database:', error);
    }
};

try {
    await seedUsers();
}
catch (e) {
    console.log("Couldn't seed users");
}





// above users then create a bunch of races
const seedRaces = async () => {
    try {
        // making races, username is just the CREATOR, not REGISTERED
        const races = [
            {//1
                raceName: 'NY Marathon',
                username: 'caroline',
                raceCity: 'New York',
                raceState: 'NY',
                raceDate: '2024-11-01',
                raceTime: '16:00',
                distance: "Half Marathon",
                terrain: ['Street'],
                raceUrl: 'https://www.nymarathon.org',
            },
            {//2
                raceName: 'Boston Marathon',
                username: 'deanfil',
                raceCity: 'Boston',
                raceState: 'MA',
                raceDate: '2025-04-15',
                raceTime: '09:00',
                distance: "Marathon",
                terrain: ['Rocky', "Inclined"],
                raceUrl: 'https://www.baa.org',
            },
            {//3
                raceName: 'Chicago Marathon',
                username: 'tysaito',
                raceCity: 'Chicago',
                raceState: 'IL',
                raceDate: '2024-10-13',
                raceTime: '07:30',
                distance: "Half Marathon",
                terrain: ["Muddy"],
                raceUrl: 'https://www.chicagomarathon.com',
            },
            { //4
                raceName: 'Summit 5K',
                username: 'tysaito',
                raceCity: 'Summit',
                raceState: 'NJ',
                raceDate: '2024-12-10',
                raceTime: '10:00',
                distance: "5K",
                terrain: ["Beach"],
                raceUrl: 'https://www.summit5K.com',
            },
            { // 5
                raceName: 'Miami Marathon',
                username: 'tysaito',
                raceCity: 'Miami',
                raceState: 'FL',
                raceDate: '2024-08-22',
                raceTime: '10:00',
                distance: "Marathon",
                terrain: ["Beach"],
                raceUrl: 'https://www.miamimarathon.com',
            },
            { // 6
                raceName: 'Malibu Marathon',
                username: 'caroline',
                raceCity: 'Malibu',
                raceState: 'CA',
                raceDate: '2024-02-12',
                raceTime: '12:00',
                distance: "Marathon",
                terrain: ["Beach"],
                raceUrl: 'https://www.malibumarathon.com',
            },
            { //7
                raceName: 'Austin Half Marathon',
                username: 'caroline',
                raceCity: 'Austin',
                raceState: 'TX',
                raceDate: '2024-10-12',
                raceTime: '08:00',
                distance: "Half Marathon",
                terrain: ["Street", "Grass"],
                raceUrl: 'https://www.austinhalf.com',
            },
            { //8
                raceName: 'Ann Arbor Marathon',
                username: 'deanfil',
                raceCity: 'Ann Arbor',
                raceState: 'MI',
                raceDate: '2024-10-27',
                raceTime: '08:00',
                distance: "Marathon",
                terrain: ["Street", "Grass"],
                raceUrl: 'https://www.aamarathon.com',
            }

        ];

        // Loop through the race data and create each race in the database
        for (const race of races) {
            await raceData.create(
                race.raceName,
                race.username,
                race.raceCity,
                race.raceState,
                race.raceDate,
                race.raceTime,
                race.distance,
                race.terrain,
                race.raceUrl
            );
            console.log(`Race created: ${race.raceName}`);
        }

        console.log('Successfully seeded the database with 10 races.');
    } catch (error) {
        console.error('Error seeding the database:', error);
    }
};

try {
    await seedRaces();
}
catch (e) {
    console.log("Couldn't seed races");
}

console.log("Seed completed, database loaded...Please quit with ctrl + C or equivalent command")