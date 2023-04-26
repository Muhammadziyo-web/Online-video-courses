module.exports = {
  SELECTID: "SELECT * FROM categories where cat_id = $1",
  SELECTALL: "SELECT * FROM categories",
  GETCOURSES:
    "SELECT * FROM sap_categoriya  where catrefid=(select cat_id from categories WHERE catname= $1)",
  GETSUBJECT:
    "SELECT * FROM videos where categoriesId =(select cat_id from categories WHERE catname = $1) AND sap_categoriyaId =(select sapid from sap_categoriya WHERE sap_categoriya.sapname = $2);",
  GETVIDEO:
    "SELECT * FROM videos where categoriesId =(select cat_id from categories WHERE catname = $1) AND sap_categoriyaId =(select sapid from sap_categoriya WHERE sap_categoriya.sapname = $2) limit 1 offset $3",
  GETCOMMENT:
    "SELECT * FROM comments where videoId =(SELECT videoid FROM videos where categoriesId =(select cat_id from categories WHERE catname = $1) AND sap_categoriyaId =(select sapid from sap_categoriya WHERE sap_categoriya.sapname = $2) limit 1 offset $3)",
  REGISTER:
    "INSERT INTO users(username,login,password) VALUES ($2,$3,crypt($4,$1))",
  LOGIN: "SELECT token from users WHERE login = $1 and PASSWORD=crypt($2,$3)",
  POSTVIDEOCHECK:
    "SELECT * from categories LEFT JOIN sap_categoriya on cat_id=catRefId WHERE catname =$1 AND sapname = $2",
  POSTVIDEO:
    "INSERT INTO videos( userId, title, path, categoriesId, sap_categoriyaId) VALUES($1,$2,$3,$4,$5)",
  FINDIDBYNAME: "select $1 from $2 where $3=$4",
  FINDIDBYTOKEN: "select userid from users where token= $1",
  POSTCOMMENT:
    "INSERT INTO comments(userId, videoId, comment) VALUES($1,$2,$3)",
  DELETEVIDEO: "delete  from videos where videoid=$1 and userid=$2",
  DELETECOMMENT: "delete  from comments where commentid=$1 and userid=$2",
};
