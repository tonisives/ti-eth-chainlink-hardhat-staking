// const { ProvidePlugin } = require("webpack")
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  // reactScriptsVersion: "react-scripts",
  webpack: {
    configure: {
      plugins: [
        // new ProvidePlugin({
        //   Buffer: ["buffer", "Buffer"],
        // }),
        // new ProvidePlugin({
        //   process: "process/browser",
        // }),
        // new NodePolyfillPlugin()
      ],
      // resolve: {
      //   fallback: {
      //     stream: require.resolve("stream-browserify"),
      //     buffer: require.resolve("buffer"),
      //   },
      // },
    },
  },
}


/*
module.exports = {
  reactScriptsVersion: "react-scripts",
  webpack: {
    configure: (webpackConfig) => {
      const plugins = [
        new ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
        new ProvidePlugin({
          process: "process/browser",
        }),
      ]
      const resolve = {
        fallback: {
          stream: require.resolve("stream-browserify"),
          buffer: require.resolve("buffer"),
        },
      }

      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === "ModuleScopePlugin"
      )

      webpackConfig.plugins = plugins
      webpackConfig.resolve = resolve

      webpackConfig.resolve.plugins ?? [].splice(scopePluginIndex, 1)
      return webpackConfig
    },
  },
}
*/