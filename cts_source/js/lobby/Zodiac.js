import React from "react";

import Aquarius from "../assets/zodiac/aquarius.png";
import Aries from "../assets/zodiac/aries.png";
import Cancer from "../assets/zodiac/cancer.png";
import Capricorn from "../assets/zodiac/capricorn.png";
import Gemini from "../assets/zodiac/gemini.png";
import Leo from "../assets/zodiac/leo.png";
import Libra from "../assets/zodiac/libra.png";
import Pisces from "../assets/zodiac/pisces.png";
import Sagittarius from "../assets/zodiac/sagittarius.png";
import Scorpio from "../assets/zodiac/scorpio.png";
import Taurus from "../assets/zodiac/taurus.png";
import Virgo from "../assets/zodiac/virgo.png";

function Zodiac(props) {
	const assetMap = {
		Capricorn: Capricorn,
		Aquarius: Aquarius,
		Pisces: Pisces,
		Aries: Aries,
		Taurus: Taurus,
		Gemini: Gemini,
		Cancer: Cancer,
		Leo: Leo,
		Virgo: Virgo,
		Libra: Libra,
		Scorpio: Scorpio,
		Sagittarius: Sagittarius
	};
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				marginBottom: 8
			}}
		>
			<img
				className="zodiac-icon"
				alt={props.zodiac}
				src={assetMap[props.zodiac]}
			/>
			<p className="zodiac">{props.zodiac}</p>
		</div>
	);
}

export default Zodiac;
