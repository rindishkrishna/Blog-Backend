const jwt = require("jsonwebtoken");
const User = require("../Models/User");

exports.authenticate = function (req, res, next) {
  var token = req.headers.auth.split(" ")[1];
  if (!token) return res.status(401).send(" token invalid");
  try {
    var decoded = jwt.decode(token, process.env.PRIVATEKEY);
    req.user = decoded;
    console.log("verified jwt token");
    if (req.user.id) {
      User.find({ _id: req.user.id }, (err, user) => {
        if (!err) {
          if (!user) return res.status(500).send("Invalid user");
          return next();
        } else return res.status(500).send("Invalid input");
      });
    } else return res.status(500).send("Missing user.id");
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "invalid token" });
  }
};
