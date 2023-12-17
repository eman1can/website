import React from "react";
import {Grid, Row, Col} from "react-flexbox-grid";

import WebsiteIcon from "../assets/site.svg";
import TwitterIcon from "../assets/twitter.svg";
import LetterboxdIcon from "../assets/letterboxd.svg";

function SocialMediaRow(props) {
	return (
		<Grid>
			<Row center="xs">
				<Col>
					<a
						href={props.website}
						rel="noopener noreferrer"
						target="_blank"
					>
						<img
							style={{
								height: props.size,
								marginRight: props.size
							}}
							alt="website"
							src={WebsiteIcon}
						/>
					</a>
				</Col>
				<Col>
					<a
						href={props.twitter}
						rel="noopener noreferrer"
						target="_blank"
					>
						<img
							style={{
								height: props.size,
								marginRight: props.size
							}}
							alt="twitter"
							src={TwitterIcon}
						/>
					</a>
				</Col>
				<Col>
					<a
						href={props.letterboxd}
						rel="noopener noreferrer"
						target="_blank"
					>
						<img
							style={{height: props.size}}
							alt="letterboxd"
							src={LetterboxdIcon}
						/>
					</a>
				</Col>
			</Row>
		</Grid>
	);
}

export default SocialMediaRow;
