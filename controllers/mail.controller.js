import emoji from "node-emoji";

import mailService from "../services/mail.service.js";

export const sendContactFormEmail = async (req, res) => {
	try {
		const { body } = req;

		const info = await mailService.sendEmail(body);
		if (info) {
			console.log(
				emoji.get("heavy_check_mark"),
				` E-mail sended with success: ${info}`
			);
			return res.status(200).send(info);
		} else {
			throw new Error("There was an error, the e-mail couldn't be sended.");
		}
	} catch (error) {
		res.status(404).send(error.message);
		console.log(emoji.get("x"), ` ${error.message}`);
	}
};
