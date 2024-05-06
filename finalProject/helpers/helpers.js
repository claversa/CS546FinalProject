export let notStringOrEmpty = (val, undef) => {
    if (!val) throw `Error: ${undef} is undefined`;
    if (typeof val !== "string") throw `Error: input for ${undef} must be a string`;
    if (val.trim().length === 0) throw "Error: input must not be empty or just spaces";
    return val.trim(); // trims whitespace
}

export let isValidNumber = (val, undef) => {
    if (!val) throw `Error: ${undef} is undefined`;
    if (typeof val !== "string") throw `Error: input for ${undef} must be a string`;
    if (val.trim().length === 0) throw "Error: input must not be empty or just spaces";
    const number = parseFloat(val);
    if (isNaN(number)) throw `Error: ${undef} must be a valid number`;
    return number;
}

export let validDate = (date) => { // got this function from https://www.freecodecamp.org/news/how-to-validate-a-date-in-javascript/
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(date)) throw "Error: Invalid date format";
    const [month, day, year] = date.split('/').map(Number);
    const dateObject = new Date(year, month - 1, day);
    return !isNaN(dateObject.getTime()) && dateObject.getFullYear() === year && dateObject.getMonth() === month - 1 && dateObject.getDate() === day;
}

export let isDateAfterToday = (date, militaryTime) => {
    const [hour, minute] = militaryTime.split(':').map(Number);
    const today = new Date();
    today.setUTCHours(hour, minute, 0, 0);
    const inputDate = new Date(date);
    inputDate.setUTCHours(hour, minute, 0, 0);
    return inputDate > today;
}

export let dateAway = (date) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    inputDate.setUTCHours(0, 0, 0, 0);
    return inputDate - today;
}

export let validURL = (val) => {
    // regex for allowed url patterns
    const urlRegex = /^https:\/\/(?:www\.)?[\w.-]+\.[a-zA-Z]{2,}(?:\/[\w-./?=&%+]*)?$/;
    if (!urlRegex.test(val)) throw `Error: ${val} is an invalid website URL`;
}

export let validState = (state) => {
    if (state.length != 2) throw "Error: must provide valid 2-letter state acronym";
    let stateAbbrev = ['al', 'ak', 'az', 'ar', 'as', 'ca', 'co', 'ct', 'de', 'dc', 'fl', 'ga', 'gu', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'mp', 'oh', 'ok', 'or', 'pa', 'pr', 'ri', 'sc', 'sd', 'tn', 'tx', 'tt', 'ut', 'vt', 'va', 'vi', 'wa', 'wv', 'wi', 'wy']; // valid state abbrevs
    if (!(stateAbbrev.includes(state.toLowerCase()))) throw "Error: must provide valid state abbreviation";
    return state.toUpperCase();
}

export let validTime = (timeStr) => {
    const timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeFormat.test(timeStr)) throw "Error: Please use HH:MM in military time.";

    const [hours, minutes] = timeStr.split(':').map(numStr => parseInt(numStr, 10));

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) throw "Error: Hours should be between 00-23 and minutes between 00-59."

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
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
            return x * 0.621371;
        case "Kilogram":
            return x * 2.20462;
        default:
            throw "unknown unit";
    }
}

export let imperialToMetric = (x, type) => {
    switch (type) {
        case "Mile":
            return x / 0.621371;
        case "Pound":
            return x / 2.20462;
        default:
            throw "unknown unit";
    }
}

export let validEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) { throw "Error: Please provide a valid email" };
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

export let validBirthdate = (dateString) => {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(dateString)) throw "Error: Invalid birthdate format";
    const [month, day, year] = dateString.split('/').map(Number);
    const dateObject = new Date(year, month - 1, day);
    return !isNaN(dateObject.getTime()) && dateObject.getFullYear() === year && dateObject.getMonth() === month - 1 && dateObject.getDate() === day;
};

export let validPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_+()=])[^\s]{8,}$/;
    if (!passwordRegex.test(password)) { throw "Error: Please provide a valid password that is at least 8 characters with at least 1 uppercase letter, number, and special character" };
    // return password.toLowerCase();
    return password;
};

export let validUsername = (username) => {
    const usernameRegex = /^[a-zA-Z]{5,10}$/;
    if (!usernameRegex.test(username)) { throw "Error: Please provide a valid username with between 5-10 characters" };
    return username.toLowerCase();
};