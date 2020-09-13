const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  swaggerDefinition: {
    info: {
      title: "Post Vote  API Documentation",
      version: "1.0.0",
      description: "A documention of Backend API written in Nodejs.",
    },
  },
  apis: ["./src/Controllers/User.js", "./src/Controllers/Post.js"],
};
const specs = swaggerJsdoc(options);
module.exports = specs;
