module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
      "/wx": {
        target: "https://api.weixin.qq.com",
        pathRewrite: { "^/wx": "" }
      },
      "/api": {
        target: "http://47.115.19.185:8989"
      }
    },
    host: "0.0.0.0",
  }
}