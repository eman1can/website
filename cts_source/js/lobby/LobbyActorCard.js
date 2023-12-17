import React, {useState} from "react";
import {Button, Card, Spin, AutoComplete, Input} from "antd";
import {Grid, Row} from "react-flexbox-grid";
import {searchActor, getZodiacSign, getTMDBImage} from "../util";

import Zodiac from "./Zodiac";

import Placeholder from "../assets/placeholder.svg";
import Close from "../assets/close.svg";

function ActorSelector(props) {
	const [options, setOptions] = useState([]);
	const [value, setValue] = useState("");

	const onSearch = query => {
		if (query == null || query === "") {
			setOptions([]);
			return;
		}
		searchActor(query)
			.then(response => {
				const data = response.data;
				const filteredForPhotos = data.results.filter(
					star => star.profile_path != null
				);
				if (query.toLowerCase() === "eric bai") {
					filteredForPhotos.push({name: "Eric Bai", id: -1});
				} else if (query.toLowerCase() === "amanda hum") {
					filteredForPhotos.push({name: "Amanda Hum", id: -2});
				}
				if (filteredForPhotos === 0) {
					setOptions([]);
				} else {
					const actors = filteredForPhotos.slice(0, 5).map(result => {
						return {
							value: result.id,
							label: result.name
						};
					});
					setOptions(actors);
				}
			})
			.catch(() => setOptions([]));
	};

	return (
		<Grid
			fluid
			style={{
				padding: "0 7px",
				display: "flex",
				flexDirection: "column",
				height: "100%"
			}}
		>
			{props.loading ? (
				<Row
					style={{
						marginTop: 27,
						marginBottom: 27,
						justifyContent: "center",
						flexShrink: 0
					}}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							positon: "relative"
						}}
					>
						<Spin className="spinner" size="large" />
					</div>
				</Row>
			) : (
				<>
					<Row style={{flexGrow: 1}}>
						<div
							style={{
								position: "relative",
								width: "100%",
								height: "100%"
							}}
						>
							<img
								alt="actor placeholder"
								className="placeholder unselectable"
								src={Placeholder}
							/>
						</div>
					</Row>
					<Row style={{flexShrink: 0}}>
						<AutoComplete
							defaultActiveFirstOption
							value={value}
							options={options}
							style={{width: 250}}
							onSelect={props.onSelect}
							onSearch={onSearch}
							onChange={v => setValue(v)}
							placeholder="Enter a movie star's name"
						>
							<Input className="actor-input" />
						</AutoComplete>
					</Row>
					<Row style={{justifyContent: "center", flexShrink: 0}}>
						<Button
							className="choose-for-me"
							type="primary"
							onClick={props.onChooseForMe}
						>
							Choose For Me
						</Button>
					</Row>
				</>
			)}
		</Grid>
	);
}

function Actor(props) {
	var zodiac = null;
	if (props.actor.birthday != null) {
		const bdayArr = props.actor.birthday.split("-");
		zodiac = getZodiacSign(parseInt(bdayArr[1]), parseInt(bdayArr[2]));
	}
	const background =
		props.actor.id > 0
			? `url(${getTMDBImage(props.actor.profile_path, "lg")})`
			: `url(${props.actor.profile_path})`;

	return (
		<Grid
			fluid
			className="unselectable"
			style={{
				padding: "0 7px",
				textAlign: "center",
				width: "100%",
				height: "100%",
				background: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0), rgba(0, 0, 0, 1)), ${background}`,
				backgroundSize: "100% auto",
				display: "flex",
				flexDirection: "column"
			}}
		>
			<Row style={{flexGrow: 1}}></Row>
			<Row center="xs" style={{flexShrink: 0, padding: 8}}>
				<h2 style={{color: "#fff"}}>{props.actor.name}</h2>
			</Row>
			{zodiac != null && (
				<Row center="xs" style={{flexShrink: 0}}>
					<Zodiac zodiac={zodiac} />
				</Row>
			)}

			<Row style={{flexShrink: 0}}>
				<Button
					style={{flexShrink: 0}}
					className="choose-for-me"
					type="primary"
					onClick={props.clearActor}
				>
					<img
						alt="Close"
						src={Close}
						style={{
							filter: "invert(100%)",
							marginRight: 8,
							marginTop: -3
						}}
					/>
					<span style={{paddingTop: 1}}>Clear</span>
				</Button>
			</Row>
		</Grid>
	);
}

function LobbyActorCard(props) {
	return (
		<Card className="actor-card">
			<div className="actor-number">{props.num}</div>
			{props.actor ? (
				<Actor actor={props.actor} clearActor={props.clearActor} />
			) : (
				<ActorSelector
					onSelect={props.onSelect}
					onChooseForMe={props.onChooseForMe}
					loading={props.loading}
				/>
			)}
		</Card>
	);
}

export default LobbyActorCard;
