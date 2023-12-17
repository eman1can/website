import React, {useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Alert, Button, message, Layout, Spin} from "antd";
import {Grid, Row, Col} from "react-flexbox-grid";
import Logo from "../assets/logo.png";
import Particles from "react-tsparticles";
import CreditsSection from "./CreditsSection";
import OptionsModal from "./OptionsModal";
import LobbyActorCard from "./LobbyActorCard";
import DynamicButton from "../DynamicButton";
import ConnectTheStarsPoster from "../assets/cts-poster.jpg";
import {
	InfoCircleFilled,
	ArrowRightOutlined,
	SettingFilled
} from "@ant-design/icons";
import Close from "../assets/close.svg";
import Eric from "../assets/eric.jpg";
import Amanda from "../assets/amanda.jpg";
import {
	getRandomItemFromArray,
	parseActorDetails,
	getActorCredits,
	updateAlternateTitles,
	getActor,
	isNormalInteger,
	shouldFilterFilm,
} from "../util";
import {SUBTITLE_OPTIONS} from "../constants";

const {Content} = Layout;
var slugify = require("slugify");

const GENERIC_ERROR = {
	content: "Something went wrong! Try again.",
	className: "message lobby-error",
	icon: <div />
};

function getAlternateTitles(credit1, credit2, onSuccess, onComplete) {
	const altToMainMap = {};
	const filmSet = new Set();
	credit1.forEach(f => filmSet.add({id: f.id, title: f.title}));
	credit2.forEach(f => filmSet.add({id: f.id, title: f.title}));
	updateAlternateTitles(
		[...filmSet],
		altToMainMap,
		alt => onSuccess(credit1, credit2, alt),
		() => {
			message.destroy();
			message.error(GENERIC_ERROR);
			onComplete();
		}
	);
}

function fetchGameInitData(actor1, actor2, onSuccess, onComplete) {
	if (actor1.id === actor2.id) {
		message.destroy();
		message.error({
			content: `You must really love ${actor1.name}. But you should choose two different actors.`,
			className: "message lobby-error",
			icon: <div />,
			duration: 6
		});
		onComplete();
		return;
	}

	// *** EASTER EGG CODE START ***
	if ((actor1.id < 0 && actor2.id > 0) || (actor1.id > 0 && actor2.id < 0)) {
		const notAnActor = actor1.id > 0 ? actor2 : actor1;
		message.destroy();
		message.error({
			content: `You won't get very far trying to connect ${notAnActor.name} with a real movie star.`,
			className: "message lobby-error",
			icon: <div />,
			duration: 6
		});
		onComplete();
		return;
	}

	if (actor1.id < 0 && actor2.id < 0) {
		const connectTheStarsOnly = [
			{
				id: -3,
				title: "Connect the Stars",
				poster_path: ConnectTheStarsPoster
			}
		];
		getAlternateTitles(
			connectTheStarsOnly,
			connectTheStarsOnly,
			onSuccess,
			onComplete
		);
		return;
	}
	// *** EASTER EGG CODE END ***

	Promise.all([getActorCredits(actor1), getActorCredits(actor2)])
		.then(function(results) {
			const credit1 = results[0].data.credits.cast.filter(shouldFilterFilm);
			const credit2 = results[1].data.credits.cast.filter(shouldFilterFilm);
			getAlternateTitles(credit1, credit2, onSuccess, onComplete);
		})
		.catch(function(error) {
			message.destroy();
			message.error(GENERIC_ERROR);
			onComplete();
		});
}

function Unselectable(props) {
	return (
		<Button
			type="link"
			tabIndex="-1"
			style={{
				height: "100%",
				whiteSpace: "normal",
				cursor: "default",
				...props.style
			}}
		>
			{props.children}
		</Button>
	);
}

function Lobby(props) {
	const [actor1, setActor1] = useState(null);
	const [actor2, setActor2] = useState(null);
	const [actor1Loading, setActor1Loading] = useState(false);
	const [actor2Loading, setActor2Loading] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [startLoading, setStartLoading] = useState(false);
	const [
		constellationBackgroundRef,
		setConstellationBackgroundRef
	] = useState(React.createRef());
	const [onMount, setOnMount] = useState(true);

	const [byline, setByline] = useState(
		getRandomItemFromArray(SUBTITLE_OPTIONS)
	);

	const [width, setWidth] = useState(window.innerWidth);
	const handleWindowSizeChange = () => {
		setWidth(window.innerWidth);
	};
	const refreshParticles = () => {
		if (constellationBackgroundRef != null) {
			props.refreshLayoutConfig();
			constellationBackgroundRef.forceUpdate();
		}
	};
	useEffect(() => {
		window.addEventListener("resize", refreshParticles);
		window.addEventListener("resize", handleWindowSizeChange);
		return function cleanup() {
			window.removeEventListener("resize", refreshParticles);
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	});

	useEffect(() => {
		if (onMount) {
			props.refreshLayoutConfig();
			setOnMount(false);
		}
	}, [onMount, props]);

	const onSelect = (id, setActor, setLoading) => {
		if (id === -1) {
			setActor({
				id: id,
				name: "Eric Bai",
				profile_path: Eric,
				birthday: "1995-05-24"
			});
			return;
		}
		if (id === -2) {
			setActor({
				id: id,
				name: "Amanda Hum",
				profile_path: Amanda,
				birthday: "1995-02-26"
			});
			return;
		}
		setLoading(true);
		getActor(id)
			.then(response => {
				props.addRolledID(id);
				setActor(parseActorDetails(response.data));
			})
			.catch(() => {
				setLoading(false);
				message.error(GENERIC_ERROR);
			})
			.then(() => setLoading(false));
	};

	const onChooseForMe = (otherActor, setActor, setLoading) => {
		const randomID = getRandomItemFromArray(
			props.actorIDs.filter(rID => {
				if (props.rolledIDs.has(rID)) {
					return false;
				}
				if (otherActor != null && rID === otherActor.id) {
					return false;
				}
				return true;
			})
		);
		onSelect(randomID, setActor, setLoading);
	};

	const {pathname, search} = useLocation();
	const history = useHistory();
	const updateActorParam = (actor, paramKey) => {
		const params = new URLSearchParams(search);
		if (actor != null) {
			params.set(paramKey, `${actor.id}-${slugify(actor.name)}`);
		} else {
			params.delete(paramKey);
		}
		history.replace({pathname, search: params.toString()});
	};

	useEffect(() => {
		updateActorParam(actor1, "from");
	}, [actor1]);

	useEffect(() => {
		updateActorParam(actor2, "to");
	}, [actor2]);

	useEffect(() => {
		const params = new URLSearchParams(search);
		const from = params.get("from");
		const to = params.get("to");
		if (actor1 == null && from != null) {
			const id = from.split("-")[0];
			if (isNormalInteger(id)) {
				onSelect(parseInt(id), setActor1, setActor1Loading);
			}
		}
		if (actor2 == null && to != null) {
			const id = to.split("-")[0];
			if (isNormalInteger(id)) {
				onSelect(parseInt(id), setActor2, setActor2Loading);
			}
		}
	}, [search]);

	let isMobile = width <= 768;

	const OptionsButton = buttonProps => {
		return (
			<DynamicButton
				forDesktop={buttonProps.forDesktop}
				onClick={() => setShowOptions(true)}
				icon={<SettingFilled />}
				label="Options"
			/>
		);
	};

	return (
		<Layout style={{minHeight: "100%"}}>
			<Content className="lobby-body">
				<div className="frame-layout__wrapper">
					<div className="frame-layout__particles-container">
						<Particles
							ref={constellationBackground =>
								setConstellationBackgroundRef(
									constellationBackground
								)
							}
							options={props.particlesConfig}
							className="frame-layout__particles"
						/>
					</div>
					<div
						className="frame-layout__container"
						style={{
							width: "100%",
							height: "100%",
							display: "flex",
							flexDirection: "column"
						}}
					>
						{isMobile && !props.closedMobileAlert && (
							<Alert
								icon={<InfoCircleFilled />}
								message="Connect the Stars is better on desktop browsers."
								banner
								closable
								onClose={props.onCloseMobileAlert}
								closeText={<img alt="Close" src={Close} />}
							/>
						)}
						<div
							style={{
								position: "absolute",
								top: 18,
								left: 18,
								zIndex: 2
							}}
						>
							<props.HowToPlayButton forDesktop={true} />
						</div>
						<div
							style={{
								position: "absolute",
								top: 18,
								right: 18,
								zIndex: 2
							}}
						>
							<OptionsButton forDesktop={true} />
						</div>
						<Spin spinning={startLoading} size="large">
							<Grid fluid style={{margin: 35, flexGrow: 1}}>
								<Row center="xs">
									<Col>
										<Unselectable style={{padding: 0}}>
											<img
												className="unselectable"
												src={Logo}
												alt="Logo"
												style={{width: 56}}
											/>
										</Unselectable>
									</Col>
								</Row>
								<Row center="xs">
									<Col>
										<Unselectable style={{padding: 0}}>
											<h1
												className="unselectable"
												style={{
													color: "#fff",
													marginBottom: 0
												}}
											>
												{"Connect the Stars"}
											</h1>
										</Unselectable>
									</Col>
								</Row>
								<Row center="xs">
									<Col style={{marginBottom: 50}}>
										<Button
											style={{
												height: "100%",
												whiteSpace: "normal",
												marginBottom: 0,
												textShadow:
													"0px 0px 4px #14181c"
											}}
											type="text"
											onClick={() =>
												setByline(
													getRandomItemFromArray(
														SUBTITLE_OPTIONS.filter(
															i => i !== byline
														)
													)
												)
											}
										>
											<h2 className="byline">
												{`- ${byline} -`}
											</h2>
										</Button>
									</Col>
								</Row>
								<Row
									className="how-to-play-for-mobile"
									center="xs"
									style={{marginBottom: 50}}
								>
									<Col>
										<props.HowToPlayButton
											forDesktop={false}
										/>
									</Col>
									<Col style={{marginLeft: 16}}>
										<OptionsButton forDesktop={false} />
									</Col>
								</Row>
								<Row center="xs">
									<Col>
										<Unselectable>
											<h2 className="byline">
												Choose two movie stars
											</h2>
										</Unselectable>
									</Col>
								</Row>
								<Row center="xs">
									<Col>
										<LobbyActorCard
											num="1"
											actor={actor1}
											clearActor={() => setActor1(null)}
											loading={actor1Loading}
											onSelect={id =>
												onSelect(
													id,
													setActor1,
													setActor1Loading
												)
											}
											onChooseForMe={() => {
												onChooseForMe(
													actor2,
													setActor1,
													setActor1Loading
												);
											}}
										/>
									</Col>
									<Col>
										<LobbyActorCard
											num="2"
											actor={actor2}
											clearActor={() => setActor2(null)}
											loading={actor2Loading}
											onSelect={id =>
												onSelect(
													id,
													setActor2,
													setActor2Loading
												)
											}
											onChooseForMe={() => {
												onChooseForMe(
													actor1,
													setActor2,
													setActor2Loading
												);
											}}
										/>
									</Col>
								</Row>
								<Row
									center="xs"
									style={{marginTop: 24, marginBottom: 56}}
								>
									<Col>
										<Button
											className={[
												"btn-on-stars",
												(actor1 == null ||
													actor2 == null) &&
													"hide"
											]}
											ghost
											style={{marginTop: 40}}
											type="primary"
											onClick={() => {
												setStartLoading(true);
												fetchGameInitData(
													actor1,
													actor2,
													(
														credit1,
														credit2,
														alternateTitles
													) =>
														props.startGame(
															[
																{
																	actor: actor1,
																	credits: credit1
																},
																{
																	actor: actor2,
																	credits: credit2
																}
															],
															alternateTitles
														),
													() => setStartLoading(false)
												);
											}}
										>
											Start Game
											<ArrowRightOutlined />
										</Button>
									</Col>
								</Row>
							</Grid>
							<CreditsSection />
						</Spin>
					</div>
				</div>
			</Content>
			<OptionsModal
				visible={showOptions}
				onCancel={() => setShowOptions(false)}
				options={props.options}
			/>
		</Layout>
	);
}

export default Lobby;
