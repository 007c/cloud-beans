module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-px-to-viewport")({
            viewportWidth: 735,
            exclude: [/(\/|\\)(node_modules)(\/|\\)/, /(\/|\\)(package)(\/|\\)/],
          })
        ]
      }
    }
  },
  devServer: {
    proxy: {
      "/wx": {
        target: "https://api.weixin.qq.com",
        pathRewrite: { "^/wx": "" }
      },
      "/api": {
        target: "http://47.108.63.35:8989"
      }
    },
    host: "0.0.0.0",
  }
}