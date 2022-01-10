import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class Mailer {
	constructor(user, pass) {
		this.user = user;
		this.pass = pass;
		this.transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user,
				pass,
			},
		});
	}

	sendEmail = async ({
		from = process.env.EMAIL_DIRECTION,
		to = "info@ramirozayas.com",
		subject,
		text = "",
		html = "",
		attachments = [],
	}) => {
		try {
			const mailOptions = {
				from,
				to,
				subject,
				text,
				html,
				attachments,
			};

			const promise = new Promise((res, rej) => {
				this.transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						console.log(error);
						rej(error);
					} else {
						console.log("Email sent: " + info.response);
						res(info.messageId);
					}
				});
			});

			const info = await promise;
			return info;
		} catch (error) {
			console.log(error);
		}
	};
}

const contactMailer = new Mailer(
	process.env.EMAIL_DIRECTION,
	process.env.EMAIL_PASSWORD
);

export default contactMailer;
