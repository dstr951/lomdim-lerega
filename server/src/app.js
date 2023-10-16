const express = require("express");
const mongoose = require("mongoose").default;

console.log("starting mongoose with version: " + mongoose.version);
const cors = require("cors");
const bodyParser = require("body-parser");
const routerUsers = require("./routes/Users");
const routerTeachers = require("./routes/Teachers");
const routerStudents = require("./routes/Students");
const routerTeachingRequests = require("./routes/TeachingRequests");

const app = express();
const http = require("http");
const server = http.createServer(app);
try {
  require("custom-env").env(process.env.NODE_ENV, "src/config");
  console.log(
    ".env file loaded with these parameters: ",
    process.env.MONGODB_URI
  );
} catch (err) {
  console.log(err);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.use(cors());
    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    });
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json({ limit: "1000mb" }));
    app.use("/api/Users", routerUsers);
    app.use("/api/Teachers", routerTeachers);
    app.use("/api/Students", routerStudents);
    app.use("/api/TeachingRequests", routerTeachingRequests);
    app.use(express.static("./public")); //to use for public assets

    server.listen(process.env.PORT).then(() => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
