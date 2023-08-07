import mongoose from "mongoose";

// db에 들어갈 형식을 만든다.
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

// 비디오 모델 생성
const Video = mongoose.model("Video", videoSchema);
export default Video;
