var Slugify = require("slugify");

exports.slugify = (urlString) => {
  return Slugify(urlString, { lower: true });
};

exports.createExpiryDate = () => {
  var date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
};

exports.getRandomId = (length, chars) => {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
