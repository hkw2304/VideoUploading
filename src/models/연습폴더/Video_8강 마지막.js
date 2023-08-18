import mongoose from "mongoose";
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 20 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minlength: 5 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  // ObjectId는 mongoose에서 제공하는 것
  // User의 아이디를 준다는 것
  // ref: "User" : populate를 하면 해당 객체의 모든 정보들을 얻을 수 있다.
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
const Video = mongoose.model("Video", videoSchema);
export default Video;
