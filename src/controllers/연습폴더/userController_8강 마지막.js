import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  // 중복확인
  const exists = await User.exists({ $or: [{ username }, { email }] });
  // =========
  const pageTitle = "Join";
  if (password !== password2) {
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
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "no exists" });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Wrong pwd!!!" });
  }
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};
export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read_user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObject = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    console.log(emailObject);
    if (!emailObject) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObject.email });
    console.log(user);
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObject.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const see = async (req, res) => {
  // id를 가져오는건 여러 방법이 있는데 공개된 주소에서 가져올려고 파라미터에서 가져온다.
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  // console.log(user);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  // const videos = await Video.findById(id).populate("owner");
  // const videos = await Video.find({ owner: user._id });
  // console.log(videos);
  return res.render("users/profile", {
    pageTitle: `${user.name}'s Profile`,
    user,
    // videos,
  });
};
export const getEdit = (req, res) => {
  // middlewares에서 local로 자동 import되서 굳이 안줘도
  // res.render("edit-porfile", {
  //   pageTitle: "Edit Profile",
  //   user: req.session.user,
  // });
  res.render("edit-porfile", {
    pageTitle: "Edit Profile",
  });
};
export const postEdit = async (req, res) => {
  // 줄여서 이렇게도 가능 ES6문법
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  // 방법 2
  // new 해줘서 최신것들을 update해준다.
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      // 아바타를 변경안하면 오류가 생긴다 if문으로 처리
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;
  // 업데이트를하고 세션도 업데이트를 해줘야 한다.
  // 방법 1.
  // req.session.user = {
  //   ...req.session.user,
  //   name,
  //   email,
  //   username,
  //   location,
  // };
  res.redirect("/users/edit");
};
export const getChangePassword = (req, res) => {
  // 깃허브로 로그인하면 변경 불가
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPssword, newPassword, newPasswordConfirmation },
  } = req;
  const ok = await bcrypt.compare(oldPssword, password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "current password is incorrect",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    // 브라우저는 그냥 비번 들어오면 저장할려해서 status를 줘서 에러라고 알려줘야함
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password not match!!!",
    });
  }

  const user = await User.findById(_id);
  // console.log("old pw", user.password);
  user.password = newPassword;
  // console.log("new unhashed", user.password);
  await user.save();
  // 세션도 같이 없데이트 해줘야 한다.
  req.session.user.passowrd = user.password;
  // console.log("new pw", user.password);
  return res.redirect("/users/logout");
};
