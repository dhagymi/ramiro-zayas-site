import express from "express";
import errorHandler from "errorhandler";
import dotenv from "dotenv";
import morgan from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Prismic from "@prismicio/client";
import PrismicDOM from "prismic-dom";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(morgan("dev"));
app.use(errorHandler());
console.log(join(__dirname, "public"));
app.use(express.static(join(__dirname, "public")));

const initApi = (req) => {
	return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
		accessToken: process.env.PRISMIC_ACCESS_TOKEN,
		req,
	});
};

const initAutoAdminApi = (req) => {
	return Prismic.getApi(process.env.PRISMIC_AUTOADMIN_ENDPOINT, {
		accessToken: process.env.PRISMIC_AUTOADMIN_ACCESS_TOKEN,
		req,
	});
};

const handleLinkResolver = (doc) => {
	if (doc.type === "concerts") {
		return "/concerts";
	}

	if (doc.type === "contact_page") {
		return "/contact";
	}

	if (doc.type === "music_page") {
		return "/music";
	}

	if (doc.type === "gallery") {
		return "/gallery";
	}

	return "/";
};

app.use((req, res, next) => {
	res.locals.Link = handleLinkResolver;

	res.locals.PrismicDOM = PrismicDOM;

	next();
});

app.set("views", join(__dirname, "views"));
app.set("view engine", "pug");

const handleRequest = async (api) => {
	const meta = await api.getSingle("meta");
	const header = await api.getSingle("header");
	const options = await api.getSingle("options");
	const preloader = await api.getSingle("preloader");
	const social = await api.getSingle("social");
	const footer = await api.getSingle("footer");

	return {
		meta,
		header,
		preloader,
		social,
		footer,
		options,
	};
};

app.get("/", async (req, res) => {
	const api = await initApi(req);

	const defaults = await handleRequest(api);
	const home = await api.getSingle("home");

	home.data.spotify_link["target"] = home.data.spotify_link?.target
		? home.data.spotify_link.target
		: "";

	res.render("pages/home", {
		...defaults,
		home,
	});
});

app.get("/concerts", async (req, res) => {
	const api = await initApi(req);
	const autoAdminApi = await initAutoAdminApi(req);

	const defaults = await handleRequest(api);
	const { results } = await autoAdminApi.query(
		Prismic.Predicates.at("document.type", "concert")
	);

	const concertsData = results.map(({ data: concert }) => {
		const { title, location, price, status, description, date_and_hour } =
			concert;
		const [year, month, day, hours, minutes] = [
			date_and_hour.slice(0, 4),
			date_and_hour.slice(5, 7),
			date_and_hour.slice(8, 10),
			date_and_hour.slice(11, 13),
			date_and_hour.slice(14, 16),
		];
		return {
			data: {
				title,
				location,
				price,
				status,
				description,
				year,
				month,
				day,
				hours,
				minutes,
			},
		};
	});

	concertsData.sort((a, b) => {
		const dayDifference = a.data.day - b.data.day;
		const monthDifference = a.data.month - b.data.month;
		const yearDifference = a.data.year - b.data.year;
		return yearDifference !== 0
			? yearDifference
			: monthDifference !== 0
			? monthDifference
			: dayDifference;
	});

	const concerts = await api.getSingle("concerts");

	res.render("pages/concerts", {
		...defaults,
		concerts,
		concertsData,
	});
});

app.get("/contact", async (req, res) => {
	const api = await initApi(req);

	const defaults = await handleRequest(api);
	const contact = await api.getSingle("contact_page");

	res.render("pages/contact", {
		...defaults,
		contact,
	});
});

app.get("/music", async (req, res) => {
	const api = await initApi(req);

	const defaults = await handleRequest(api);
	const music = await api.getSingle("music_page");
	music.data["album"] = music.data.album.map(({ album_image, album_link }) => {
		album_link["target"] = album_link?.target ? album_link.target : "";
		return {
			image: album_image,
			link: album_link,
		};
	});
	music.data["videos"] = music.data.videos.map(
		({ video_image, video_link }) => {
			video_link["target"] = video_link?.target ? video_link.target : "";
			return {
				image: video_image,
				link: video_link,
			};
		}
	);

	res.render("pages/music", {
		...defaults,
		music,
	});
});

app.get("/gallery", async (req, res) => {
	const api = await initApi(req);
	const autoAdminApi = await initAutoAdminApi(req);

	const defaults = await handleRequest(api);
	const gallery = await api.getSingle("gallery");
	const {
		data: { photo: galleryImages },
	} = await autoAdminApi.getSingle("gallery_image");
	const galleryData = [];

	for (let i = 0; i < galleryImages.length / 9; i++) {
		const gallerySet = [];
		for (let j = 0; j < 9; j++) {
			galleryImages[i * 9 + j] && gallerySet.push(galleryImages[i * 9 + j]);
		}
		galleryData.push(gallerySet);
	}

	res.render("pages/gallery", {
		...defaults,
		gallery,
		galleryData,
	});
});

const server = app.listen(PORT, () =>
	console.log(`Serve on http://localhost:${PORT}`)
);
server.on("error", (error) => console.log(error));
