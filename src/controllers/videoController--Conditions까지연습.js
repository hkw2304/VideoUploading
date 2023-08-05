// 가짜 유저
const fakeUser = {
  username: "kiwon",
  loggedIn: false,
};

export const tranding = (req, res) => {
  // html 요소를 이런식을 길게 주는것은 옳지 않다.
  // res.send(
  //   "<!DOCTYPE html><html lang='ko'><head><title>Youtube</title></head><body><h1>Home</h1><footer>&copy; 2023 Youtude - All rights reserved</footer></body>"
  // );
  // 그래서 pug를 사용
  // view를 랜더링한다
  // 렌더링 하면서 pug와 변수들을 보낼 수 있다
  res.render("home", { pageTitle: "Home", cook: "potato", fakeUser: fakeUser });
};
export const see = (req, res) => {
  res.render("watch", { pageTitle: "Watch" });
  // res.send("Watch");
};
export const edit = (req, res) => {
  // console.log(req.params);
  // return res.send("Edit");
  res.render("edit", { pageTitle: "Edit" });
};
export const search = (req, res) => {
  res.send("Search");
};
export const upload = (req, res) => {
  res.send("upload Video");
};
export const deleteVideo = (req, res) => {
  return res.send(`Watch Video #${req.params.id}`);
  // res.send("delete Video");
};
