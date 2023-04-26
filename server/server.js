const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const fileUpload = require("express-fileupload");
const { course } = require("../router/category.routes");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "db")));
app.use(course);
app.listen(PORT, console.log("server on ..." + PORT));
