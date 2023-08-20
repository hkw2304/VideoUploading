const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// webpack은 절대경로를 필요시 해서 경로 설정을 해준다.
const path = require("path");

module.exports = {
  mode: "development",
  //   watch : 꺼지지않는다 재시작할 필요없이 바로 업데이트, 백엔드의 nodemon
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  // 어디서 파일을 가져올거냐
  entry: "./src/client/js/main.js",
  output: {
    // 실행할 파일명
    filename: "js/main.js",
    // 최적화 후 저장할 경로
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  resolve: {
    extensions: ["js", "jsx"],
  },
  module: {
    rules: [
      {
        // js파일들 변환
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        // css파일들 변환
        test: /\.scss$/,
        // 여기 순으로 적어준다.
        // webpack은 뒤에서 부터 실행한다.
        // sass -> css -> 브라우저 style
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
