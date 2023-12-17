import React from "react";
import {Grid, Row} from "react-flexbox-grid";

import IconClick from "../assets/icon-click.svg";
import IconDrag from "../assets/icon-drag.svg";
import IconZoom from "../assets/icon-zoom.svg";

function GuideText() {
	return (
		<Grid fluid>
			<Row end="xs" className="board-hint">
				<img className="board-hint-icon" src={IconClick} alt="Click" />
				<p className="board-hint-text">
					Click a Star/Film for more info
				</p>
			</Row>
			<Row end="xs" className="board-hint">
				<img className="board-hint-icon" src={IconDrag} alt=" Drag" />
				<p className="board-hint-text">
					Drag the board or a star/film around
				</p>
			</Row>
			<Row end="xs" className="board-hint">
				<img className="board-hint-icon" src={IconZoom} alt="Zoom" />
				<p className="board-hint-text">Zoom in/out of the board</p>
			</Row>
		</Grid>
	);
}

export default GuideText;
