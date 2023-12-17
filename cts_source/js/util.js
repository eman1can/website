import {ALTERNATE_TITLE_FILTER} from "./constants";
const axios = require("axios").default;
var slugify = require("slugify");

export function getRandomItemFromArray(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function toGraphKey(name) {
	return slugify(name, {
		replacement: "-",
		remove: /[.,…'?/#!$%^&*;:{}=_`~()]/g,
		lower: true
	})
		.replace(/(^the-)|(^a-)/g, "")
		.replace(/(-the-)/g, "-")
		.replace(/^[a-z]-[a-z]-/g, m => m.replace("-", ""));
}

export function insertNodeToMap(map, node, key) {
	if (lookupNodeInMap(map, node.id, key)) {
		return;
	}
	if (!(key in map)) {
		map[key] = [node];
	} else {
		map[key].push(node);
	}
}

export function removeNodeFromMap(map, node, key) {
	if (!(key in map)) {
		return;
	}
	for (var i = 0; i < map[key].length; i++) {
		if (map[key][i].id.toString() === node.id.toString()) {
			map[key].pop(i);
			return;
		}
	}
}

export function lookupNodeInMap(map, id, key) {
	if (!(key in map)) {
		return false;
	}
	for (var i = 0; i < map[key].length; i++) {
		if (map[key][i].id.toString() === id.toString()) {
			return map[key][i];
		}
	}

	return false;
}

export function creditsArrayToDict(credits) {
	return credits.reduce(function(map, obj) {
		const key = toGraphKey(obj.title);
		const film = parseFilmDetails(obj);
		insertNodeToMap(map, film, key);
		return map;
	}, {});
}

export function castArrayToDict(cast) {
	return cast.reduce(function(map, obj) {
		const key = toGraphKey(obj.name);
		const actor = parseActorDetails(obj);
		insertNodeToMap(map, actor, key);
		return map;
	}, {});
}

export function parseFilmDetails(film) {
	return {
		id: film.id,
		title: film.title,
		poster_path: film.poster_path,
		popularity: film.popularity,
		release_date: film.release_date,
		vote_count: film.vote_count,
		vote_average: film.vote_average,
		genres: film.genre_ids,
		type: "film"
	};
}

export function parseActorDetails(actor) {
	return {
		id: actor.id,
		name: actor.name,
		profile_path: actor.profile_path,
		popularity: actor.popularity,
		order: actor.order,
		birthday: actor.birthday,
		gender: actor.gender,
		type: "actor"
	};
}

export function getTMDBImage(path, size) {
	// TODO it's not recommended to hard-code the image path prefix
	// see https://developers.themoviedb.org/3/getting-started/images

	// TODO show placeholder when image is null

	// TODO: choose image size based on device? what if they resize device?
	if (path == null) {
		return null;
	}

	const imageSizes = {
		lg: "w600_and_h900_bestv2",
		md: "w300_and_h450_bestv2",
		sm: "w150_and_h225_bestv2"
	};

	return `https://image.tmdb.org/t/p/${imageSizes[size]}${path}`;
}

export function getActorCredits(actor) {
	return axios.get(
		`https://api.themoviedb.org/3/person/${actor.id}`,
		{
			params: {
				api_key: process.env.REACT_APP_TMDB_API_KEY,
				append_to_response: "credits"
			}
		}
	);
}

export function getFilmCredits(film) {
	return axios.get(`https://api.themoviedb.org/3/movie/${film.id}`, {
		params: {
			api_key: process.env.REACT_APP_TMDB_API_KEY,
			append_to_response: "credits,keywords"
		}
	});
}

export function getAlternateTitles(film) {
	return axios.get(
		`https://api.themoviedb.org/3/movie/${film.id}/alternative_titles`,
		{
			params: {
				api_key: process.env.REACT_APP_TMDB_API_KEY
			}
		}
	);
}

export function searchActor(query) {
	return axios.get("https://api.themoviedb.org/3/search/person", {
		params: {
			api_key: process.env.REACT_APP_TMDB_API_KEY,
			query: query
		}
	});
}

export function getActor(id) {
	return axios.get(`https://api.themoviedb.org/3/person/${id}`, {
		params: {
			api_key: process.env.REACT_APP_TMDB_API_KEY
		}
	});
}

export function updateAlternateTitles(
	films,
	altToMainMap,
	onSuccess,
	onComplete
) {
	// NOTE: altToMainMap is mutated by this function
	const filmsToGetAlternates = films.filter(film =>
		film.title.match(ALTERNATE_TITLE_FILTER)
	);
	Promise.all(filmsToGetAlternates.map(f => getAlternateTitles(f)))
		.then(function(results) {
			const altTitles = results
				.map((r, i) => {
					r.data.titles = r.data.titles.filter(f =>
						["US", "GB"].includes(f.iso_3166_1)
					);
					return {
						...r.data,
						mainTitle: filmsToGetAlternates[i].title
					};
				})
				.filter(f => f.titles.length > 0);
			altTitles.forEach(alt => {
				const mainTitle = toGraphKey(alt.mainTitle);
				alt.titles
					.map(o => o.title)
					.forEach(t => {
						const altKey = toGraphKey(t);
						if (!altKey.startsWith(mainTitle)) {
							insertNodeToMap(
								altToMainMap,
								{id: alt.id, key: mainTitle},
								altKey
							);
						}
					});
			});
			onSuccess(altToMainMap);
		})
		.catch(function(error) {
			onComplete && onComplete();
		});
}

export function copyTextToClipboard(text, onSuccess, onError) {
	function fallbackCopyTextToClipboard(text) {
		var textArea = document.createElement("textarea");
		textArea.value = text;

		// Avoid scrolling to bottom
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			document.execCommand("copy");
			onSuccess && onSuccess();
		} catch (err) {
			onError && onError();
		}

		document.body.removeChild(textArea);
	}

	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text).then(
		function() {
			onSuccess && onSuccess();
		},
		function(err) {
			onError && onError();
		}
	);
}

export function getZodiacSign(month, day) {
	//bound is zero indexed and returns the day of month where the boundary occurs
	//ie. bound[0] = 20; means January 20th is the boundary for a zodiac sign
	var bound = [20, 19, 20, 20, 20, 21, 22, 22, 21, 22, 21, 21];
	//startMonth is zero indexed and returns the zodiac sign of the start of that month
	//ie. startMonth[0] = "Capricorn"; means start of January is Zodiac Sign "Capricorn"
	var startMonth = [
		"Capricorn",
		"Aquarius",
		"Pisces",
		"Aries",
		"Taurus",
		"Gemini",
		"Cancer",
		"Leo",
		"Virgo",
		"Libra",
		"Scorpio",
		"Sagittarius"
	];
	const monthIndex = month - 1; //so we can use zero indexed arrays
	var signMonthIndex;
	if (day <= bound[monthIndex]) {
		//it's start of month -- before or equal to bound date
		signMonthIndex = monthIndex;
	} else {
		//it must be later than bound, we use the next month's startMonth
		signMonthIndex = (monthIndex + 1) % 12; //mod 12 to loop around to January index.
	}
	return startMonth[signMonthIndex]; //return the Zodiac sign of start Of that month.
}

export function numToWords(num) {
	const underTwenty = [
		"zero",
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
		"ten",
		"eleven",
		"twelve",
		"thirteen",
		"fourteen",
		"fifteen",
		"sixteen",
		"seventeen",
		"eighteen",
		"nineteen"
	];
	const tens = [
		"twenty",
		"thirty",
		"forty",
		"fifty",
		"sixty",
		"seventy",
		"eighty",
		"ninety"
	];
	const thousands = [
		"thousand",
		"million",
		"billion",
		"trillion",
		"quadrillion"
	];

	function twoDigit(n) {
		if (n < 20) {
			return underTwenty[n];
		}
		if (n % 10 === 0) {
			return tens[parseInt(n / 10) - 2];
		}
		return `${tens[parseInt(n / 10) - 2]} ${underTwenty[n % 10]}`;
	}

	function threeDigit(n) {
		const remainder = n % 100;
		const out = [`${underTwenty[parseInt(n / 100)]} hundred`];
		if (remainder !== 0) {
			out.push(twoDigit(remainder));
		}
		return out.join(" ");
	}

	function underThousand(n) {
		if (n < 100) {
			return twoDigit(n);
		}
		return threeDigit(n);
	}

	if (num < 1000) {
		return underThousand(num);
	}

	const batches = [];
	var temp = num;
	while (temp / 1000 > 0) {
		batches.push(temp % 1000);
		temp = parseInt(temp / 1000);
	}

	var out = [];
	for (var i = 0; i < batches.length - 1; i++) {
		if (batches[i] !== 0) {
			out.push(underThousand(batches[i]));
		}
		if (batches[i + 1] !== 0) {
			out.push(thousands[i]);
		}
	}
	out.push(underThousand(batches[batches.length - 1]));
	return out.reverse().join(" ");
}

export function isNormalInteger(str) {
	var n = Math.floor(Number(str));
	return n !== Infinity && String(n) === str && n >= 0;
}

export function shouldFilterFilm(film) {
	const today = new Date();
	return film.poster_path != null // film must have a poster
		&& new Date(film.release_date) <= today // film must be released
		&& !film.genre_ids.includes(99); // film must not be a documentary
}
