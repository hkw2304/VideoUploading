import mongoose from "mongoose";

// db에 들어갈 형식(모델)을 만든다.
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 20 },
  description: { type: String, required: true, trim: true, minlength: 5 },
  // Date.now()     ()가 들어간 함수식은 실행 하면 바로 실행이 된다. 그래서 () 제거해서 submit이 될때만 실행하게 한다.
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// 비디오 모델 생성
const Video = mongoose.model("Video", videoSchema);
export default Video;
