import React, {useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import Lobby from "./lobby/Lobby";
import Game from "./game/Game";
import HowToPlayModal from "./HowToPlayModal";
import DynamicButton from "./DynamicButton";
import {InfoCircleFilled} from "@ant-design/icons";
import {
	toGraphKey,
	creditsArrayToDict,
	insertNodeToMap,
	parseActorDetails,
	parseFilmDetails
} from "./util";
import {getLayoutConfig, getParticlesConfig} from "./particleUtil";
import {
	ACTOR_IDS,
	EXPANDED_ACTOR_IDS,
	BOLLYWOOD_ACTOR_IDS,
	PRE_BLOCKBUSTER_IDS
} from "./constants";

function parseAPIDataForGame(apiData, alternateTitles) {
	const foundActors = apiData.reduce(function(map, obj) {
		const foundNode = {
			id: obj.actor.id,
			credits: creditsArrayToDict(obj.credits)
		};
		insertNodeToMap(map, foundNode, toGraphKey(obj.actor.name));
		return map;
	}, {});

	const answersActors = apiData.reduce(function(map, obj) {
		const actor = parseActorDetails(obj.actor);
		insertNodeToMap(map, actor, toGraphKey(actor.name));
		return map;
	}, {});

	const answersFilms = apiData.reduce(function(map, obj) {
		obj.credits.forEach(credit => {
			const film = parseFilmDetails(credit);
			insertNodeToMap(map, film, toGraphKey(film.title));
		});
		return map;
	}, {});

	const initData = {
		foundActors: foundActors,
		answersActors: answersActors,
		foundFilms: {},
		answersFilms: answersFilms,
		alternateTitles: alternateTitles,
		start: parseActorDetails(apiData[0].actor),
		end: parseActorDetails(apiData[1].actor)
	};
	return initData;
}

function Home(props) {
	const [gameInitData, setGameInitData] = useState(null);
	const [showHowToPlay, setShowHowToPlay] = useState(false);

	const [layoutConfig, setLayoutConfig] = useState(getLayoutConfig());
	const [particlesConfig, setParticlesConfig] = useState(
		getParticlesConfig()
	);

	let initialSeenIDs = new Set();
	try {
		const storedSeenIDs = localStorage.getItem('seen_ids');
		initialSeenIDs = storedSeenIDs ? new Set(JSON.parse(storedSeenIDs)) : new Set();
	} catch (e) {
		initialSeenIDs = new Set();
	}

	const [rolledIDs, setRolledIDs] = useState(initialSeenIDs);
	const [closedMobileAlert, setClosedMobileAlert] = useState(
		localStorage.getItem('closed_mobile_alert') === 'true' ?? false
	);
	const [useStandardSet, setUseStandardSet] = useState(
		localStorage.getItem('use_default_set') !== 'false' ?? true);
	const [useExpandedSet, setUseExpandedSet] = useState(
		localStorage.getItem('use_expanded_set') === 'true' ?? false
	);
	const [useBollywoodSet, setUseBollywoodSet] = useState(
		localStorage.getItem('use_bollywood_set') === 'true' ?? false
	);
	const [usePreBlockbusterSet, setUsePreBlockbusterSet] = useState(
		localStorage.getItem('use_pre_blockbuster_set') === 'true' ?? false
	);
	const [cannotUseSeries, setCannotUseSeries] = useState(
		localStorage.getItem('cannot_use_series') === 'true' ?? false
	);

	const history = useHistory();
	const location = useLocation();

	// make sure local storage is correct
	useEffect(() => {
		localStorage.setItem('seen_ids', JSON.stringify(Array.from(rolledIDs)));
	}, [rolledIDs]);
	useEffect(() => {
		localStorage.setItem('closed_mobile_alert', closedMobileAlert.toString());
	}, [closedMobileAlert]);
	useEffect(() => {
		localStorage.setItem('use_default_set', useStandardSet.toString());
	}, [useStandardSet]);
	useEffect(() => {
		localStorage.setItem('use_expanded_set', useExpandedSet.toString());
	}, [useExpandedSet]);
	useEffect(() => {
		localStorage.setItem('use_bollywood_set', useBollywoodSet.toString());
	}, [useBollywoodSet]);
	useEffect(() => {
		localStorage.setItem('use_pre_blockbuster_set', usePreBlockbusterSet.toString());
	}, [usePreBlockbusterSet]);
	useEffect(() => {
		localStorage.setItem('cannot_use_series', cannotUseSeries.toString());
	}, [cannotUseSeries]);

	// ensure at least one option is on
	useEffect(() => {
		if (!useStandardSet && !useExpandedSet && !useBollywoodSet && !usePreBlockbusterSet){
			setUseStandardSet(true);
		}
	}, [useStandardSet, useExpandedSet, useBollywoodSet, usePreBlockbusterSet]);

	let actorIDs = [];
	if (useStandardSet) {
		actorIDs = actorIDs.concat(ACTOR_IDS);
	}
	if (useExpandedSet) {
		actorIDs = actorIDs.concat(EXPANDED_ACTOR_IDS);
	}
	if (useBollywoodSet) {
		actorIDs = actorIDs.concat(BOLLYWOOD_ACTOR_IDS);
	}
	if (usePreBlockbusterSet) {
		actorIDs = actorIDs.concat(PRE_BLOCKBUSTER_IDS);
	}

	const addRolledID = id => {
		// TODO this logic could be refined to account for
		// option changes between rolls
		rolledIDs.add(id);
		let difference = new Set(actorIDs);
		for (let elem of rolledIDs){
			difference.delete(elem);
		}
		if (difference.size === 0) {
			setRolledIDs(new Set());
		} else {
			setRolledIDs(new Set(rolledIDs));
		}
	};

	const refreshLayout = () => {
		setLayoutConfig(getLayoutConfig());
		setParticlesConfig(getParticlesConfig());
	};

	const HowToPlayButton = buttonProps => {
		return (
			<DynamicButton
				forDesktop={buttonProps.forDesktop}
				showIconWhenDesktopHidden={
					buttonProps.showIconWhenDesktopHidden
				}
				onClick={() => setShowHowToPlay(true)}
				icon={<InfoCircleFilled />}
				label="How To Play"
			/>
		);
	};

	return (
		<>
			<HowToPlayModal
				visible={showHowToPlay}
				onCancel={() => setShowHowToPlay(false)}
			/>
			{!gameInitData ? (
				<Lobby
					startGame={(apiData, alternateTitles) =>
						setGameInitData(
							parseAPIDataForGame(apiData, alternateTitles)
						)
					}
					HowToPlayButton={HowToPlayButton}
					particlesConfig={particlesConfig}
					refreshLayoutConfig={refreshLayout}
					rolledIDs={rolledIDs}
					addRolledID={addRolledID}
					actorIDs={actorIDs}
					closedMobileAlert={closedMobileAlert}
					onCloseMobileAlert={() => setClosedMobileAlert(true)}
					options={{
						useStandardSet,
						setUseStandardSet,
						useExpandedSet,
						setUseExpandedSet,
						useBollywoodSet,
						setUseBollywoodSet,
						usePreBlockbusterSet,
						setUsePreBlockbusterSet,
						cannotUseSeries,
						setCannotUseSeries,
					}}
				/>
			) : (
				<Game
					gameInitData={gameInitData}
					particlesConfig={particlesConfig}
					howToPlayButton={
						<HowToPlayButton
							forDesktop={true}
							showIconWhenDesktopHidden={true}
						/>
					}
					goBack={() => {
						const params = new URLSearchParams(location.search);
						params.delete("from");
						params.delete("to");
						history.replace({
							pathname: location.pathname,
							search: params.toString()
						});
						setGameInitData(null);
					}}
					layoutConfig={layoutConfig}
					refreshLayoutConfig={refreshLayout}
					cannotUseSeries={cannotUseSeries}
				/>
			)}
		</>
	);
}

export default Home;
