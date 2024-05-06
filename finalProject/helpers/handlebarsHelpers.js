import Handlebars from "handlebars";

Handlebars.registerHelper("add", function (value, addition) {
  return value + addition;
});

Handlebars.registerHelper("eq", function (arg1, arg2, options) {
  if (arg1 === arg2) {
    return options.fn(this);
  }
});

// Define a Handlebars helper function to look up values in the times array
Handlebars.registerHelper('lookupTimes', function(times, weekIndex, dayIndex) {
    // Parse the JSON string to get the times array
    times = JSON.parse(times);
    
    // Check if the times array is defined and has the appropriate structure
    if (Array.isArray(times) && times[weekIndex] && times[weekIndex][dayIndex] !== undefined) {
        // Return the value from the times array at the specified indices
        return times[weekIndex][dayIndex];
    } else {
        // Return an empty string if the value is not found
        return "";
    }
});


export default Handlebars;
