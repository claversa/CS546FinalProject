export let exists = (input, undef) => {
    if (!input) throw `Error: ${undef} is undefined`;
}


export let notStringOrEmpty = (val, undef) => {
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

export let validWebsite = (val) => {
    if (val.length < 11) throw "Error: invalid website url";
    if (val.slice(0, 11) !== "http://www.") throw "Error: manufacturer website must begin with http://www.";
    if (val.slice(-4) !== ".com") throw "Error: manufacturer website must end with .com";
    if (val.length < 20) throw "Error: manufacturer website must have at least 5 characters between http://www. and .com";
    val = val.toLowerCase().slice(11, -4);
    let validChars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.', '_', '\u002D'];
    // regular dash = \u002D
    for (let letter of val) {
        if (!(validChars.includes(letter))) throw `Error: ${letter} is an invalid URL character`;
    }
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
    if (!Array.isArray(val)) throw `Error: ${error} must be of type array`;
    if (val.length === 0) throw `Error: ${error} must have at least one string element in it`
    for (let i = 0; i < val.length; i++) {
        if (typeof val[i] !== 'string') throw `Error: all elements in ${error} must be strings`;
        val[i] = val[i].trim(); // trims every internal string
        if (val[i].length === 0) throw `Error: all elements in ${error} must be non empty`
    }
    return val // return new array
}