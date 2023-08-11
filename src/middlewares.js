export const localsMiddleware = (req, res, next) => {
  // 세션내용을 locals에 넘겨준다.
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Youtube!!";
  res.locals.loggedInUser = req.session.user;
  console.log(req.session);
  console.log(res.locals);
  next();
  //   next() 해줘야 다음 미들웨어가 실행된다.
};
