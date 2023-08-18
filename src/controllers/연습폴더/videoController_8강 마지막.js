// import { query } from "express";
import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "asc" });
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  // populate : 해당 객체의 포함된 모든 정보들을 얻을 수 있다.
  const videos = await Video.findById(id).populate("owner");
  console.log(videos);
  // 영상 올린사람 작업 방법 1.
  // const owner = await User.findById(videos.owner);
  if (videos) {
    return res.render("watch", {
      pageTitle: videos.title,
      videos,
      // owner,
    });
  }
  return res.status(404).render("404", { pageTitle: "Video not found." });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const videos = await Video.findById(id);
  if (!videos) {
    res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if (String(videos.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", {
    pageTitle: `Editing: ${videos.title}`,
    videos,
  });
};
export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const videos = await Video.findById(id);
  if (!videos) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(videos.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`^${keyword}`),
      },
    });
  }
  res.render("search", { pageTitle: "search", videos });
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  // remove가 있지만 그냥 쓰지마
  const {
    user: { _id },
  } = req.session;
  const videos = await Video.findById(id);
  if (!videos) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(videos.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  // console.log(id);
  return res.redirect("/");
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  // const { file } = req.file;
  // es6문법
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title: title,
      description,
      fileUrl,
      owner: _id,
      // fileUrl: file.path,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
