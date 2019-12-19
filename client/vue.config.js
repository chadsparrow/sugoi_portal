const path = require("path");

module.exports = {
  chainWebpack: config => {
    config.module.rules.delete("eslint");
  },
  outputDir: path.resolve(__dirname, "../server/public"),
  devServer: {
    proxy: {
      "/api": {
        target: "https://localhost:5000",
        ws: true,
        changeOrigin: true,
        https: true
      }
    }
  }
};
