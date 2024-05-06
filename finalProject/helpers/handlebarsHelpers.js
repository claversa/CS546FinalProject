import Handlebars from "handlebars";

Handlebars.registerHelper("add", function (value, addition) {
  return value + addition;
});

Handlebars.registerHelper("eq", function (arg1, arg2, options) {
  if (arg1 === arg2) {
    return options.fn(this);
  }
});

export default Handlebars;
