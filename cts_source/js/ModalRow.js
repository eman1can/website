import React from "react";
import {Grid, Row} from "react-flexbox-grid";
import "./App.css";

function ModalRow(props) {
	const padding = `${props.paddingTop || 0}px ${props.paddingHorizontal ||
		80}px ${props.paddingBottom || 24}px`;
	return (
		<Grid style={{padding: padding}}>
			{props.prefix && (
				<Row style={{justifyContent: "center", marginBottom: 16}}>
					{props.prefix}
				</Row>
			)}
			{props.title && (
				<Row style={{justifyContent: "center"}}>
					<p className="modal-title">{props.title}</p>
				</Row>
			)}
			{props.heading && (
				<Row
					style={{
						justifyContent: "center",
						maxWidth: props.maxWidth || "none",
						margin: "0 auto"
					}}
				>
					<p className="modal-heading">{props.heading}</p>
				</Row>
			)}
			{props.body && (
				<Row style={{justifyContent: "center", marginBottom: 4}}>
					<p className="modal-body">{props.body}</p>
				</Row>
			)}
			{props.zodiac && (
				<Row style={{justifyContent: "center"}}>{props.zodiac}</Row>
			)}
			{props.socialMedia && (
				<Row style={{justifyContent: "center", marginTop: 12}}>
					{props.socialMedia}
				</Row>
			)}
		</Grid>
	);
}

export default ModalRow;
