export const getConcerts = async (api, Prismic) => {
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
		const dayDifference = a.data.day - b.data.day;
		const monthDifference = a.data.month - b.data.month;
		const yearDifference = a.data.year - b.data.year;
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
};

export const outerHtmlTemplate = (observerNumber, innerHtml) => {
	return `<div class="concerts__shows__littleList">
				${innerHtml}
				<div class="concerts__shows__littleList__observer" data-observer="${observerNumber}"></div>
			</div>
		`;
};

export const innerHtmlTemplate = ({
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
}) => {
	return `<article class="concerts__shows__cardWrapper" data-animation="fade">
				<p class="concerts__shows__date">${day}.${month}.${year}</p>
				<h2 class="concerts__shows__title">${title}</h2>
				<div class="concerts__shows__content">
					<p class="concerts__shows__info">Time: ${hours}:${minutes}</p>
					<p class="concerts__shows__info">Location: ${location} <a href="https://www.google.com/search?q=${location}" target="_blank">(map)</a></p><p class="concerts__shows__info">Price: €${price}</p><p class="concerts__shows__info">Status: ${status}</p>
					<p class="concerts__shows__info">Description: ${description}</p>
				</div>
			</article>`;
};
