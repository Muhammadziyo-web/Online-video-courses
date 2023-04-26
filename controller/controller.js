const { fetch, fetchAll } = require("../database/pg");
const fs = require("fs");
const path = require("path");
const {
  SELECTID,
  SELECTALL,
  GETCOURSES,
  GETSUBJECT,
  GETVIDEO,
  GETCOMMENT,
  REGISTER,
  LOGIN,
  POSTVIDEOCHECK,
  POSTVIDEO,
  FINDIDBYNAME,
  FINDIDBYTOKEN,
  POSTCOMMENT,
  DELETEVIDEO,
  DELETECOMMENT,
} = require("../models/category.model");

module.exports = {
  // ALL CATEGORIES
  getCategories: async (req, res) => {
    if (!isNaN(+req.params.id)) {
      res.send(await fetch(SELECTID, req.params.id));
    } else {
      res.send(await fetchAll(SELECTALL));
    }
  },
  // COURSES
  getCourses: async (req, res) => {
    try {
      res.send(await fetch(GETCOURSES, req.params.courseName));
    } catch (error) {
      res.send(error.message);
    }
  },
  // SUBJECT
  getSubject: async (req, res) => {
    try {
      res.send(
        await fetch(GETSUBJECT, req.params.courseName, req.params.subjectName)
      );
    } catch (error) {
      res.end(error.message);
    }
  },
  // VIDEO
  getVideo: async (req, res) => {
    try {
      res.send({
        video: await fetch(
          GETVIDEO,
          req.params.courseName,
          req.params.subjectName,
          req.params.videoId - 1
        ),
        comments: await fetch(
          GETCOMMENT,
          req.params.courseName,
          req.params.subjectName,
          req.params.videoId - 1
        ),
      });
    } catch (error) {
      res.send(error.message);
    }
  },
  // COMMENT
  getComment: async (req, res) => {
    try {
      res.send(
        await fetch(
          GETVIDEO,
          req.params.courseName,
          req.params.subjectName,
          req.params.videoId - 1
        )
      );
    } catch (error) {
      res.send(error.message);
    }
  },
  // REGISTER
  register: async (req, res) => {
    try {
      let { username, login, password } = req.body;
      let data = await fetch(
        REGISTER,
        process.env.CRYPT_CODE,
        username,
        login,
        password
      );

      data = data.length
        ? { Message: data, status: 400 }
        : await fetch(LOGIN, login, password, process.env.CRYPT_CODE);

      res.send(data);
    } catch (error) {
      res.send({ Message: error.message, status: 400 });
    }
  },
  // LOGIN
  login: async (req, res) => {
    try {
      let { login, password } = req.body;
      let data = await fetch(LOGIN, login, password, process.env.CRYPT_CODE);
      data = data.length ? data : [{ status: 400, message: "Bad request" }];
      res.send(data);
    } catch (error) {
      res.send(error.message);
    }
  },
  // POST VIDEO
  postVideo: async (req, res) => {
    try {
      let { categoriya, sap_categoriya: sap_categoriyas, nomi } = req.body;
      let file = req.files.file;
      if (categoriya && sap_categoriyas && nomi && file) {
        if (await fetch(POSTVIDEOCHECK, categoriya, sap_categoriyas)) {
          file.mv(
            path.join(
              __dirname,
              "..",
              "db",
              categoriya +
                "-" +
                sap_categoriyas +
                "-" +
                nomi +
                "." +
                file.mimetype.split("/")[1]
            )
          );
          // mv end

          let userId = await fetch("select userId from users where token=$1", [
            req.headers.token,
          ]);
          let pathVid =
            (await "/") +
            categoriya +
            "-" +
            sap_categoriyas +
            "-" +
            nomi +
            "." +
            file.mimetype.split("/")[1];

          let [{ cat_id: categoriesId }] = await fetch(
            "select cat_id  from categories where catname=$1",
            categoriya
          );
          let [{ sapid: sap_categoriyaId } = {}] =
            (await fetch(
              "select sapId  from sap_categoriya where sapName=$1",
              sap_categoriyas
            )) ?? [];
          let token = req.headers.token;
          let [{ userid: userID }] = await fetch(FINDIDBYTOKEN, token);

          let response = await fetch(
            POSTVIDEO,
            userID,
            nomi,
            pathVid,
            categoriesId,
            sap_categoriyaId
          );
          res.json(response.length ? response : { message: "Added video" });
        } else {
          throw new Error("400");
        }
      } else {
        throw new Error("400");
      }
    } catch (error) {
      res.send(error.message);
    }
  },

  // COMMENTS
  postComment: async (req, res) => {
    let token = req.headers.token;
    let [{ userid: userID }] = await fetch(FINDIDBYTOKEN, token);
    let { videoId, comment } = req.body;
    if ((videoId, comment)) {
      fetch(POSTCOMMENT, userID, videoId, comment);
      res.json({ message: "Comment added", status: 200 });
    } else {
      res.json({ message: "Bad request", status: 400 });
    }
  },

  // PUT VIDEO
  putVideo: async (req, res) => {
    try {
      let { categoriya, sap_categoriya: sap_categoriyas, nomi } = req.body;
      let file = req.files?.file;

      let allData = await fetch(POSTVIDEOCHECK, categoriya, sap_categoriyas);
      if (allData) {
        let pathVid =
          (await "/") +
          categoriya +
          "-" +
          sap_categoriyas +
          "-" +
          nomi +
          "." +
          file.mimetype.split("/")[1];

        let oldData = await fetch(
          "select * from videos where videoId=$1",
          req.params.videoId
        );

        let [{ path: oldPath }] = oldData;
        if (oldPath !== pathVid) {
          let src = await fetch(
            "select * from videos where path=$1 and videoid<>$2",
            oldPath,
            oldData[0].videoid
          );
          if (!src.length) {
            fs.unlink(path.join(__dirname, "..", "db", oldPath), (err) => {});

            file.mv(
              path.join(
                __dirname,
                "..",
                "db",
                categoriya +
                  "-" +
                  sap_categoriyas +
                  "-" +
                  nomi +
                  "." +
                  file.mimetype.split("/")[1]
              )
            );
          }
        }
        await fetch(
          "update videos set title = COALESCE($1,title),path =COALESCE($2,path) where videoid=$3",
          nomi,
          pathVid,
          oldData[0].videoid
        );
        res.end("ok");
      } else {
        throw new Error(400);
      }
    } catch (error) {
      res.send(error.message);
    }
  },

  // DELETE VIDEO
  delVideo: async (req, res) => {
    req.headers.token;
    let [{ userid: userId }] = await fetch(FINDIDBYTOKEN, req.headers.token);
    await fetch(DELETEVIDEO, req.params.videoId, userId);
    res.end("ok");
  },

  // DELETE COMMENT
  delComment: async (req, res) => {
    req.headers.token;
    let userId = (await fetch(FINDIDBYTOKEN, req.headers.token))?.[0]?.userid;
    let result = await fetch(DELETECOMMENT, req.params.commentId, userId);
    res.end("ok");
  },

  check: async (req, res, next) => {
    let token = req.headers.token;
    let result = await fetch("select * from users where token=$1", token);
    if (result.length) {
      return next();
    } else {
      res.json([{ message: "Auth failed", status: 400 }]);
    }
  },
};
