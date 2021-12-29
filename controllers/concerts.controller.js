import Prismic from "@prismicio/client";

import { initAutoAdminApi } from "../app.js";
import concertsService from "../services/concerts.service.js";

export const getConcerts = async (req, res) => {
	const autoAdminApi = await initAutoAdminApi(req);

	const concertsList = await concertsService.getConcerts(autoAdminApi, Prismic);

	res.send(concertsList);
};
