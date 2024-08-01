import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "giwonvideoupload/images",
  Condition: {
    StringEquals: {
      "s3:x-amz-acl": ["public-read"],
    },
  },
});
const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "giwonvideoupload/videos",
  Condition: {
    StringEquals: {
      "s3:x-amz-acl": ["public-read"],
    },
  },
});
export const localsMiddleware = (req, res, next) => {
  // 세션내용을 locals에 넘겨준다.
  // locals은 자동적으로 views(pug)에 import 된다.
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Youtube!!";
  // || {} : 혹시모를 에러를 대비해 user의 정보가 없으면 그냥 널객체를 넘겨준다.
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  next();
  //   next() 해줘야 다음 미들웨어가 실행된다.
};

// 로그인안된 유저의 접근을 막는 미들웨어
export const protectedMiddleware = (req, res, next) => {
  // 유저정보가 있으면 다음 함수 진행 없으면 로그인 페이지로 redirect
  if (req.session.loggedIn) {
    return next();
  } else {
    // req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    // req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

// 사용자가 업로드한 파일을 upload란 곳에 저장 하라
export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 100000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});
