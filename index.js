const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const specs = require("./src/Swagger/Swagger");
const cors = require("cors");
const Post = require("./src/Models/Post");
require("dotenv/config");

var app = express();

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.set("json spaces", 2);
const server = require("http").createServer(app);
const io = require("socket.io")(server);
server.listen(process.env.PORT, () => {
  console.log("Express server started at " + process.env.PORT);
});
io.on("connection", function (socket) {
  console.log(`socket connection established ${socket.id}`);
  socket.on("chat", function (data) {
    console.log(data);
    socket.join(data.handle);
    io.sockets.in(data.handle).emit("chatting", data);
  });
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
    console.log(data);
  });
  socket.on("sending", async function (data) {
    const query = await Post.find().sort({ createdOn: -1 });
    io.sockets.emit("post", { query: query });
  });
});

//------------------Controllers------------------------------

const userController = require("./src/Controllers/User");
const postController = require("./src/Controllers/Post");
const ensureAuth = require("./src/Middlewares/Auth");

//------------------Swagger API documentation----------------

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//------------------MongoDB connection-----------------------

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);

const db = process.env.MONGO_URL;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to mongo db"))
  .catch(() => console.log("mongodb connection error"));

//-----------------------Signup APIs----------------------------

app.post("/api/user/login", userController.userSignup);
app.get("/api/user", userController.allUsers);
app.get("/api/me", ensureAuth.authenticate, userController.myDetails);

//-----------------------Posts APIs----------------------------

app.post(
  "/api/user/createPost",
  ensureAuth.authenticate,
  postController.createPost
);
app.get("/api/user/posts", ensureAuth.authenticate, postController.getAllPost);
app.post(
  "/api/user/likePost",
  ensureAuth.authenticate,
  postController.likePost
);
app.post(
  "/api/user/dislikePost/",
  ensureAuth.authenticate,
  postController.dislikePost
);

module.exports = app;
