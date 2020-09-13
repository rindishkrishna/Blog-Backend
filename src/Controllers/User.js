const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const async = require("../Middlewares/Async");
const bcrypt = require("bcrypt");
/**
 * @swagger
 *
 * /api/user/login:
 *   post:
 *     description: Register to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Registers a user
 */
exports.userSignup = async (req, res) => {
  try {
    user = new User({
      username: req.body.email,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      userType: req.body.userType,
    });
    const salt = await bcrypt.genSalt(5);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = jwt.sign(
      { id: user._id, name: user.username },
      process.env.PRIVATEKEY
    );
    res.send({ token: token });
  } catch {
    res.send("invalid user details");
  }
};
/**
 * @swagger
 *
 * /api/user/me:
 *   get:
 *     security:
 *       - Bearer: []
 *     description: Get my details.It requires jwt token "auth" to be passed in headers.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get my details
 */
exports.myDetails = async(async (req, res) => {
  var id = req.user.id;
  const query = await User.findById(id);
  return res.send(query);
});
/**
 * @swagger
 *
 * /api/user/:
 *   get:
 *     description: Get list of all users.It requires jwt token "auth" to be passed in headers.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get list of all users.
 */
exports.allUsers = async(async (req, res) => {
  const query = await User.find();
  return res.send(query);
});
