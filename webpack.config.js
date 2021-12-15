const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirApp = path.join(__dirname, "app");
const dirImages = path.join(__dirname, "images");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");
const dirVideos = path.join(__dirname, "videos");
const dirNode = "node_modules";

module.exports = {
	entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.sass")],

	resolve: {
		modules: [dirApp, dirImages, dirShared, dirStyles, dirVideos, dirNode],
	},

	plugins: [
		new webpack.DefinePlugin({
			IS_DEVELOPMENT,
		}),

		new CopyWebpackPlugin({
			patterns: [
				{
					from: "./shared",
					to: "",
				},
			],
		}),

		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),

		new ImageMinimizerPlugin({
			minimizerOptions: {
				plugins: [
					["gifsicle", { interlaced: true }],
					["jpegtran", { progressive: true }],
					["optipng", { optimizationLevel: 5 }],
				],
			},
		}),
		new CleanWebpackPlugin(),
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.sass$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "",
						},
					},
					{ loader: "css-loader" },
					{ loader: "postcss-loader" },
					{ loader: "sass-loader" },
				],
			},
			{
				test: /\.(jpg?e|png|gif|svg|webp)$/,
				loader: "file-loader",
				options: {
					name() {
						return "[hash].[ext]";
					},
					outputPath: "images",
				},
			},
			{
				test: /\.(jpe?g|png|gif|svg|webp)$/i,
				use: [
					{
						loader: ImageMinimizerPlugin.loader,
						options: {
							severityError: "warning",
							minimizerOptions: {
								plugins: ["gifsicle"],
							},
						},
					},
				],
			},
			{
				test: /\.(woff2?|fnt)$/,
				loader: "file-loader",
				options: {
					name() {
						return "[hash].[ext]";
					},
					outputPath: "fonts",
				},
			},
			{
				test: /\.(glsl|frag|vert)$/,
				loader: "raw-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.(glsl|frag|vert)$/,
				loader: "glslify-loader",
				exclude: /node_modules/,
			},
		],
	},

	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
};
