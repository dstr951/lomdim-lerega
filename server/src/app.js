const express = require("express");
const mongoose = require("mongoose").default;

console.log("starting mongoose with version: " + mongoose.version);
const cors = require("cors");
const bodyParser = require("body-parser");
const routerUsers = require("./routes/Users");
const routerTeachers = require("./routes/Teachers");
const routerStudents = require("./routes/Students");

const app = express();
const http = require("http");
const server = http.createServer(app);
try {
  require("custom-env").env(process.env.NODE_ENV, "src/config");
} catch (err) {
  console.log(err);
}

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "1000mb" }));
app.use("/api/Users", routerUsers);
app.use("/api/Teachers", routerTeachers);
app.use("/api/Students", routerStudents);

app.use(express.static("server-side/src/public")); //to use for public assets

server.listen(3001);
