import { dirname, join } from "path";
import { fileURLToPath } from "url";

import webpack from "webpack";

import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";
const __dirname = dirname(fileURLToPath(import.meta.url));

const dirApp = join(__dirname, "app");
const dirImages = join(__dirname, "images");
const dirShared = join(__dirname, "shared");
const dirStyles = join(__dirname, "styles");
const dirVideos = join(__dirname, "videos");
const dirNode = "node_modules";

const config = {
	entry: [join(dirApp, "index.js"), join(dirStyles, "index.sass")],
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
			/* 			{
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
			}, */
			{
				test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
				type: "asset/resource",
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

export default config;
