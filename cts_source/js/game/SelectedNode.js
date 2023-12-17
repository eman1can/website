import React, {useState} from "react";
import {Card, ConfigProvider, List, Button, Popover} from "antd";

import {Row} from "react-flexbox-grid";

import Close from "../assets/close.svg";
import Hint from "../assets/new-hint.svg";

import {lookupNodeInMap, getTMDBImage, toGraphKey} from "../util";

function Portrait(props) {
	const backgroundURL =
		props.id > 0 ? getTMDBImage(props.imgPath, "lg") : props.imgPath;
	return (
		<div
			className="portrait"
			style={{
				backgroundImage: props.text
					? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0) 15% 66%, rgba(0,0,0,1)), url(${backgroundURL})`
					: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0) 15%), url(${backgroundURL})`,
				backgroundSize: "100% auto"
			}}
		>
			<div style={{flexGrow: 1}} />
			{props.text && (
				<div
					style={{
						paddingLeft: 6,
						paddingRight: 6,
						paddingBottom: 12,
						flexShrink: 0
					}}
				>
					<h2 style={{color: "#fff"}}>{props.text}</h2>
				</div>
			)}
		</div>
	);
}

function Actor(props) {
	return (
		<Portrait
			imgPath={props.actor.profile_path}
			text={props.actor.name}
			id={props.actor.id}
		/>
	);
}

function Film(props) {
	return <Portrait imgPath={props.film.poster_path} id={props.film.id} />;
}

function CreditsCard(props) {
	const onClick = item =>
		props.setSelectedNode({
			key: toGraphKey(item[props.labelKey]),
			id: item.id,
			type: props.type
		});

	const customizeRenderEmpty = () => (
		<div className="no-data">
			<p>No Data</p>
		</div>
	);

	return (
		<Card
			className="credits-card"
			bordered={false}
			title={props.title}
			size="small"
			style={{width: "100%", display: "flex", flexDirection: "column"}}
		>
			<div className="credits-list-container">
				<ConfigProvider renderEmpty={customizeRenderEmpty}>
					<List
						className="credits-list"
						size="small"
						dataSource={props.dataSource}
						renderItem={item => (
							<List.Item onClick={() => onClick(item)}>
								{/* eslint-disable-next-line */}
								<a
									className="list-link"
									href="#"
									onClick={() => onClick(item)}
								>
									{item[props.labelKey]}
								</a>
							</List.Item>
						)}
					/>
				</ConfigProvider>
			</div>
		</Card>
	);
}

function FilmCredits(props) {
	const cast = Object.keys(props.film.cast)
		.filter(key => key in props.foundActors)
		.reduce((arr, key) => {
			const toConcat = props.film.cast[key].filter(actor =>
				props.foundActors[key].map(a => a.id).includes(actor.id)
			);
			return arr.concat(toConcat);
		}, []);

	return (
		<CreditsCard
			setSelectedNode={props.setSelectedNode}
			labelKey="name"
			dataSource={cast}
			title="- Cast Found -"
			type="actor"
		/>
	);
}

function ActorCredits(props) {
	const credits = Object.keys(props.actor.credits)
		.filter(key => key in props.foundFilms)
		.reduce((arr, key) => {
			const toConcat = props.actor.credits[key].filter(film =>
				props.foundFilms[key].map(f => f.id).includes(film.id)
			);
			return arr.concat(toConcat);
		}, []);

	return (
		<CreditsCard
			setSelectedNode={props.setSelectedNode}
			labelKey="title"
			dataSource={credits}
			title="- Films Found -"
			type="film"
		/>
	);
}

function SelectedNode(props) {
	const {
		selectedNode,
		foundActors,
		foundFilms,
		setSelectedNode,
		answersFilms,
		answersActors,
		handleUnselectedNode
	} = props;

	const [hintPopoverVisible, setHintPopoverVisible] = useState(false);

	const type = selectedNode.id[0] === "f" ? "film" : "actor";
	const id = selectedNode.id.substring(1);
	const isFilm = type === "film";
	const isActor = type === "actor";

	var selectedFilm = null;
	var selectedFilmDetails = null;
	var selectedActor = null;
	var selectedActorDetails = null;
	if (isFilm) {
		selectedFilm = lookupNodeInMap(foundFilms, id, selectedNode.key);
		selectedFilmDetails = lookupNodeInMap(
			answersFilms,
			id,
			selectedNode.key
		);
	} else {
		selectedActor = lookupNodeInMap(foundActors, id, selectedNode.key);
		selectedActorDetails = lookupNodeInMap(
			answersActors,
			id,
			selectedNode.key
		);
	}
	// TODO use props.isFromHint if we want to style this differently for hints
	return (
		<div
			className="selected-node-info"
			style={{
				position: "absolute",
				left: 18,
				top: 121,
				width: 202,
				borderColor: "#fff"
			}}
		>
			<div
				style={{
					flexGrow: 1,
					minHeight: "2em",
					display: "flex",
					flexDirection: "coloumn",
					flexWrap: "nowrap",
					width: "100%",
					position: "relative"
				}}
			>
				{!props.cannotUseSeries &&
					<Popover
						color="#14162E"
						overlayClassName="leave-game-popover"
						placement="bottomLeft"
						title="Need a hint?"
						visible={hintPopoverVisible}
						onVisibleChange={setHintPopoverVisible}
						content={
							<div>
								<p style={{marginBottom: 24, maxWidth: 350}}>
									{`The game will add ${
										isFilm
											? "the highest billed actor"
											: "the most popular film"
									} connected to ${
										isFilm
											? selectedFilmDetails.title
											: selectedActorDetails.name
									} that you have not yet found.`}
								</p>
								<Row end="xs" style={{margin: 0}}>
									<Button
										style={{marginRight: 16}}
										ghost
										type="primary"
										onClick={() => setHintPopoverVisible(false)}
									>
										Cancel
									</Button>
									<Button
										ghost
										type="primary"
										onClick={() => {
											if (isFilm) {
												props.addActorForFilmHint(
													selectedFilm
												);
											} else {
												props.addFilmForActorHint(
													selectedActor
												);
											}
											setHintPopoverVisible(false);
										}}
									>
										Use Hint
									</Button>
								</Row>
							</div>
						}
						trigger="click"
					>
						<Button
							style={{
								position: "absolute",
								top: 3,
								left: 3
							}}
							type="link"
							icon={<img alt="Hint" src={Hint} />}
						/>
					</Popover>
				}
				<Button
					style={{
						position: "absolute",
						top: 3,
						right: 3
					}}
					onClick={handleUnselectedNode}
					type="link"
					icon={<img alt="Close" src={Close} />}
				/>
				{isFilm ? <Film film={selectedFilmDetails} /> : null}
				{isActor ? <Actor actor={selectedActorDetails} /> : null}
				<div className="title-for-small-screens">
					<h2 style={{color: "#fff"}}>
						{isFilm
							? selectedFilmDetails.title
							: selectedActorDetails.name}
					</h2>
				</div>
			</div>
			<div
				style={{
					flexGrow: 1,
					minHeight: "2em",
					display: "flex",
					flexDirection: "coloumn",
					flexWrap: "nowrap"
				}}
			>
				{isFilm ? (
					<FilmCredits
						film={selectedFilm}
						foundActors={foundActors}
						setSelectedNode={setSelectedNode}
					/>
				) : null}
				{isActor ? (
					<ActorCredits
						actor={selectedActor}
						foundFilms={foundFilms}
						setSelectedNode={setSelectedNode}
					/>
				) : null}
			</div>
		</div>
	);
}

export default SelectedNode;
