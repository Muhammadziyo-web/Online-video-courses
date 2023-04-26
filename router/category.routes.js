const { Router } = require("express");
const { defaults } = require("pg");
const {
  getCategories,
  getCourses,
  getSubject,
  getVideo,
  register,
  login,
  postVideo,
  postComment,
  putVideo,
  delVideo,
  delComment,
  check,
} = require("../controller/controller");

const course = Router();

course.get("/categories", getCategories);
course.get("/categories/:courseName", getCourses);
course.get("/categories/:courseName/:subjectName", getSubject);
course.get("/categories/:courseName/:subjectName/:videoId", getVideo);

course.post("/register", register);
course.post("/login", login);
course.post("/videos", check, postVideo);
course.post("/comments", check, postComment);
course.put("/video/:videoId", check, putVideo);
course.delete("/video/:videoId", check, delVideo);
course.delete("/comment/:commentId", check, delComment);

module.exports = { course };
