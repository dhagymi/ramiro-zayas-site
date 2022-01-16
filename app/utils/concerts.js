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
	console.log(price);
	return `<article class="concerts__shows__cardWrapper" data-animation="fade">
				<p class="concerts__shows__date">${day}.${month}.${year}</p>
				<h2 class="concerts__shows__title">${title}</h2>
				<div class="concerts__shows__content">
					${
						hours && minutes
							? `<p class="concerts__shows__info">Time: ${hours}:${minutes}</p>`
							: ""
					}
					${
						location
							? `<p class="concerts__shows__info">Location: ${location} <a href="https://google.com.ar/maps/search/${location.replace(
									" ",
									"+"
							  )}" target="_blank">(map)</a></p>`
							: ""
					}
					${
						price && price != 0
							? `<p class="concerts__shows__info">Price: €${price}</p>`
							: price && price == 0
							? `<p class="concerts__shows__info">Price: Free</p>`
							: ""
					}
					${status ? `<p class="concerts__shows__info">Status: ${status}</p>` : ""}
					${
						description
							? `<p class="concerts__shows__info">Description: ${description}</p>`
							: ""
					}
				</div>
			</article>`;
};
