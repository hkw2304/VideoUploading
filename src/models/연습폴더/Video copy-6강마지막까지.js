import mongoose from "mongoose";

// {} : 묶어줬으면 return을 하자
// export const formatHashtags = (hashtags) => {
//   return hashtags
//     .split(",")
//     .map((word) => (word.startsWith("#") ? word : `#${word}`));
// };

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
// db용 middleware 만들기
// db가 save하기전에 실행할 미들웨어, this로 접근가능
// 미들웨어는 항상 실행(생성)하기전에 만들어줘야 한다.
// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) => (word.startsWith("#") ? word : `#${word}`));
// });

// 아예 정적으로 설정해서 해주는 방법도 있다., 편한거 써라
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

// 비디오 모델 생성
// model(콜렉션명, 스키마
const Video = mongoose.model("Video", videoSchema);
export default Video;
