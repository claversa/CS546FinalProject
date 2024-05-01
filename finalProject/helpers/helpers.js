export let notStringOrEmpty = (val, undef) => {
    if (!val) throw `Error: ${undef} is undefined`;
    if (typeof val !== "string") throw `Error: input for ${undef} must be a string`;
    if (val.trim().length === 0) throw "Error: input must not be empty or just spaces";
    return val.trim(); // trims whitespace
}


export let validDate = (date) => { // got this function from https://www.freecodecamp.org/news/how-to-validate-a-date-in-javascript/
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let split = date.split('/');
    if (split.length !== 3) throw "Error: Invalid date. Must provide mm/dd/yy"
    if (split[1] <= 0 || split[1] > daysInMonth[Number(split[0]) - 1]) throw "Error: invalid day given for date";
    if (split[0] <= 0 || split[0] > 12) throw "Error: month must be between 1 and 12";
    if (split[2] > 2024 || split[2] < 1000) throw "Error: invalid year"
    if (Date.now() - new Date(date) < 0) throw "Error: release date can not be after today"
}


export let validURL = (val) => {
    // regex for allowed url patterns
    const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[a-zA-Z]{2,}(?:\/[\w-./?=&%+]*)?$/;
    if(!urlRegex.test(val)) throw `Error: ${val} is an invalid website URL`;
}

export let validState = (state) => {
    if (state.length != 2) throw "Error: must provide valid 2-letter state acronym";
    let stateAbbrev = ['al', 'ak', 'az', 'ar', 'as', 'ca', 'co', 'ct', 'de', 'dc', 'fl', 'ga', 'gu', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'mp', 'oh', 'ok', 'or', 'pa', 'pr', 'ri', 'sc', 'sd', 'tn', 'tx', 'tt', 'ut', 'vt', 'va', 'vi', 'wa', 'wv', 'wi', 'wy']; // valid state abbrevs
    if (!(stateAbbrev.includes(state.toLowerCase()))) throw "Error: must provide valid state abbreviation";
    return state.toUpperCase();
}

export let validRaceTime = (hour, min) => {
    if (hour < 0 || hour > 23) throw "Error: Please provide a valid time on the 24 hour scale";
    if (min.length != 2) throw "Error: please provide a valid two digit minute value";
    if (min[0] > 5 || min[0] < 0 || min[1] > 9 || min[1] < 0) throw "Error: please provide a valid minute value";
}

export let arraysWithStringElem = (val, error) => {
    if (!val) throw `Error: ${error} is undefined`;
    if (!Array.isArray(val)) throw `Error: ${error} must be of type array`;
    if (val.length === 0) throw `Error: ${error} must have at least one string element in it`
    for (let i = 0; i < val.length; i++) {
        if (typeof val[i] !== 'string') throw `Error: all elements in ${error} must be strings`;
        val[i] = val[i].trim(); // trims every internal string
        if (val[i].length === 0) throw `Error: all elements in ${error} must be non empty`
    }
    return val // return new array
}

export let metricToImperial = (x, type) => {
    switch (type) {
        case "Kilometer":
            return x*0.621371;
        case "Kilogram":
            return x*2.20462;
        default:
            throw "unknown unit";
    }
}

export let imperialToMetric = (x, type) => {
    switch (type) {
        case "Mile":
            return x/0.621371;
        case "Pound":
            return x/2.20462;
        default:
            throw "unknown unit";
    }
}

export let validEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {throw "Error: Please provide a valid email"};
    return email.toLowerCase();
}

export let calculateAge = (birthdate) => {
    // given MM/DD/YYYY
    const birthdateDate = new Date(birthdate);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthdateDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const birthMonth = birthdateDate.getMonth();
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthdateDate.getDate())) age--;
    return age;
}

export function validBirthdate(dateString) {
    const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateFormatRegex.test(dateString)) throw "Error: Invalid birthdate format";
    const [month, day, year] = dateString.split('/').map(Number);
    const dateObject = new Date(year, month - 1, day);
    return !isNaN(dateObject.getTime()) && dateObject.getFullYear() === year && dateObject.getMonth() === month - 1 && dateObject.getDate() === day;
}