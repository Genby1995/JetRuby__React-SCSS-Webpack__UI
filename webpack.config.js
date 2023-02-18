const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const babelLoader = (preset) => {
    const loader = {
        loader: "babel-loader",
        options: {
            presets: ["@babel/preset-env"],
        },
    };
    if (preset) {
        loader.options.presets.push(preset);
    }

    return loader;
};

const filename = (ext) =>
    isProduction ? `[name].[contenthash].${ext}` : `[name].${ext}`;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all",
        },
    };
    if (isProduction) {
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin(),
        ];
    }
    return config;
};

module.exports = {
    mode: isProduction ? "production" : "development",
    entry: {
        main: path.resolve(__dirname, "./src/index.jsx"),
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: filename("js"),
        assetModuleFilename: isProduction
            ? "assets/[hash][ext][query]"
            : "assets/[name][ext][query]",
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".scss", ".png", ".ico"],
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    optimization: optimization(),
    devServer: {
        port: 3000,
        hot: isDevelopment,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // tittle: "Friend Lee",
            template: "./src/index.html",
            minify: {
                collapseWhitespace: isProduction,
            },
        }),
        new MiniCssExtractPlugin({
            filename: filename("css"),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: babelLoader(),
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: babelLoader("@babel/preset-react"),
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(s(a|c)ss)$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|gif|svg|jpg)$/,
                exclude: /node_modules/,
                type: "asset/resource",
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                exclude: /node_modules/,
                type: "asset/resource",
            },
        ],
    },
};
