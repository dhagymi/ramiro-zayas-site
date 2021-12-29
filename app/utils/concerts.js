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
