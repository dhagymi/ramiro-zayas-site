class ContactService {
	constructor() {}

	async getConcerts(api, Prismic) {
		const { results } = await api.query(
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
			const dayDifference = b.data.day - a.data.day;
			const monthDifference = b.data.month - a.data.month;
			const yearDifference = b.data.year - a.data.year;
			return yearDifference !== 0
				? yearDifference
				: monthDifference !== 0
				? monthDifference
				: dayDifference;
		});

		const concertsWrapperList = [];

		for (let i = 0; i < concertsData.length / 3; i++) {
			const littleList = [];
			for (let j = 0; j < 3; j++) {
				const newShow = concertsData[i * 3 + j];
				if (newShow) {
					littleList.push(newShow);
				}
			}
			concertsWrapperList.push(littleList);
		}

		return concertsWrapperList;
	}
}

const contactService = new ContactService();

export default contactService;
