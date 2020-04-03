module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
      "/wx": {
        target: "https://api.weixin.qq.com",
        pathRewrite: {"^/wx": ""}
      }
    }
  }
}