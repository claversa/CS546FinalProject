import Handlebars from 'handlebars';

Handlebars.registerHelper('add', function(value, addition) {
  return value + addition;
});

export default Handlebars;
