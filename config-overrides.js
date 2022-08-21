const {
    override,
    addWebpackAlias,
} = require("customize-cra");

const path = require("path");

module.exports = override(
    addWebpackAlias({
        "/api": path.resolve(__dirname, "./src/api"),
        "/components": path.resolve(__dirname, "./src/components"),
        "/hooks": path.resolve(__dirname, "./src/hooks"),
        "/models": path.resolve(__dirname, "./src/models"),
        "/modules": path.resolve(__dirname, "./src/modules"),
        "/pages": path.resolve(__dirname, "./src/pages"),
        "/store": path.resolve(__dirname, "./src/store"),
        "/constants": path.resolve(__dirname, "./src/constants"),
        "/typedefs": path.resolve(__dirname, "./src/typedefs"),
        "/styles": path.resolve(__dirname, "./src/styles.scss"),
    }),
);
