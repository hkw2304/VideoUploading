import User from "../models/User";
import bcrypt from "bcrypt";
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  // 중복체크는 exists로,  두개를 or 체크
  const exists = await User.exists({ $or: [{ username }, { email }] });
  // const usernameExits = await User.find({ username });
  const pageTitle = "Join";
  // 비번확인
  if (password !== password2) {
    // 브라우저는 코드200을 준다 <=== 문제가 없다
    // 하지만 우리가 직접 문제가 있다고 400을줘야 한다.
    return res.status(400).render("Join", {
      pageTitle,
      errorMessage: "password confirm not match",
    });
  }
  if (exists) {
    return res.status(400).render("Join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  }
  // 두개의 경우의 수는 코드 수가 많아지니 위의 존재 여부를 간결하게 확인
  // const emailExists = await User.exists({ email });
  // if (emailExists) {
  //   return res.render("Join", {
  //     pageTitle,
  //     errorMessage: "This email is already taken",
  //   });
  // }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const edit = (req, res) => {
  res.send("Edit User");
};
export const remove = (req, res) => {
  res.send("Remove User");
};
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  // 계정 존재 확인
  const { username, password } = req.body;
  const pageTitle = "Login";
  // find : 전체나 여러개를 보고 싶을때
  // findOne : 해당하는 한가지만
  const user = await User.findOne({ username });
  // const exists = await User.exists({ username });
  if (!user) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "no exists" });
  }
  // bcrypt.compare : 해시값 비교가능
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Wrong pwd!!!" });
  }
  // 로그인하면 세션을 준다.
  // userd대한 정보를 저장한다.
  // 이제 이정보를 pug로 줘야함
  // locals이란 것은 express가 pug에서 그냥 사용할 수 있게 해준다.
  // 즉 pug에서 locals object에 그냥 접근 가능(변수명으로 그냥 접근 가능)

  // session 초기화부분
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};
export const logout = (req, res) => {
  res.send("Log-Out");
};
export const see = (req, res) => {
  res.send("See User");
};
