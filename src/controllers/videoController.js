// import { query } from "express";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "asc" });
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const videos = await Video.findById(id);

  if (videos) {
    return res.render("watch", {
      pageTitle: videos.title,
      videos,
    });
  }
  return res.status(404).render("404", { pageTitle: "Video not found." });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const videos = await Video.findById(id);
  if (videos) {
    return res.render("edit", {
      pageTitle: `Editing: ${videos.title}`,
      videos,
    });
  }
  return res.status(404).render("404", { pageTitle: "Video not found." });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const videos = await Video.findById(id);
  if (videos) {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
  }
  return res.render("404", { pageTitle: "Video not found." });
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
  await Video.findByIdAndDelete(id);
  // console.log(id);
  return res.redirect("/");
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  try {
    const { title, description, hashtags } = req.body;
    await Video.create({
      title: title,
      description,
      // hashtags: formatHashtags(hashtags),
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
