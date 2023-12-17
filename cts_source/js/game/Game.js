import React, {useState, useEffect, useRef} from "react";
import {Input, message, Button, Layout, Popover} from "antd";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {Grid, Row, Col} from "react-flexbox-grid";
import cytoscape from "cytoscape";
import d3Force from "cytoscape-d3-force";

import CytoscapeComponent from "react-cytoscapejs";
import Particles from "react-tsparticles";
import FuzzySet from "fuzzyset";

import Logo from "../assets/logo.png";
import Compass from "../assets/compass.svg";
import NewMovie from "../assets/new-movie.svg";
import NewActor from "../assets/new-actor.svg";
import NewHint from "../assets/new-hint.svg";
import Enter from "../assets/enter.svg";

import SelectedNode from "./SelectedNode";
import GuideText from "./GuideText";
import SuccessModal from "./SuccessModal";
import StatsGrid from "./StatsGrid";
import BackButton from "./BackButton";

import {
	removeNodeFromMap,
	lookupNodeInMap,
	getRandomItemFromArray,
	getTMDBImage,
	toGraphKey,
	castArrayToDict,
	creditsArrayToDict,
	insertNodeToMap,
	parseActorDetails,
	parseFilmDetails,
	getFilmCredits,
	getActorCredits,
	updateAlternateTitles,
	numToWords,
	shouldFilterFilm,
} from "../util";

import {
	RAINING_STARS_PARTICLE_OPTIONS,
	CYTOSCAPE_STYLESHEET
} from "../constants";

const {Footer, Content} = Layout;

cytoscape.use(d3Force);

function pathToList(path, answersFilms, answersActors) {
	const arr = [];
	for (var i = 0; i < path.length; i += 2) {
		arr.push(nodeToKey(path[i]));
	}
	return arr.map(node => {
		const type = node.id[0];
		const id = node.id.substring(1);
		if (type === "f") {
			const answerFilm = lookupNodeInMap(answersFilms, id, node.key);
			if (answerFilm) {
				return answerFilm;
			}
		} else {
			const answerActor = lookupNodeInMap(answersActors, id, node.key);
			if (answerActor) {
				return answerActor;
			}
		}
		return "ERROR";
	});
}

function nodeToKey(node) {
	return node._private.map.entries().next().value[1].ele._private.data;
}

function WinnerBackdrop() {
	return (
		<div className="frame-layout__particles-container" style={{zIndex: 2}}>
			<Particles
				options={RAINING_STARS_PARTICLE_OPTIONS}
				className="frame-layout__particles"
			/>
		</div>
	);
}

function Game(props) {
	const [foundFilms, setFoundFilms] = useState(props.gameInitData.foundFilms);
	const [foundActors, setFoundActors] = useState(
		props.gameInitData.foundActors
	);
	const [answersFilms, setAnswersFilms] = useState(
		props.gameInitData.answersFilms
	);
	const [answersActors, setAnswersActors] = useState(
		props.gameInitData.answersActors
	);

	const [alternateTitles, setAlternateTitles] = useState(
		props.gameInitData.alternateTitles
	);

	const [guess, setGuess] = useState("");
	const [selectedNode, setSelectedNode] = useState(null);
	const cyRef = useRef(null);
	const inputRef = useRef(null);
	const constellationBackgroundRef = useRef(null);
	const [bestPath, setBestPath] = useState(null);
	const [successModalPayload, setSuccessModalPayload] = useState(null);
	const [successModalVisible, setSuccessModalVisible] = useState(null);
	const [fuzzyCheckTimeout, setFuzzyCheckTimeout] = useState(null);
	const [spellSuggest, setSpellSuggest] = useState(null);
	const [showSuggestion, setShowSuggestion] = useState(null);
	const [hintsUsed, setHintsUsed] = useState(new Map());
	const [keywords, setKeywords] = useState(new Map());

	const [refreshLayout, setRefreshLayout] = useState(false);
	const [onMount, setOnMount] = useState(true);
	const [mobileKeyboardActive, setMobileKeyboardActive] = useState(false);

	const [width, setWidth] = useState(window.visualViewport.width);
	const [height, setHeight] = useState(window.visualViewport.height);
	const [keyboardUpHeight, setKeyboardUpHeight] = useState(height);
	const handleWindowSizeChange = () => {
		setTimeout(function() {
			setWidth(window.visualViewport.width);
			setKeyboardUpHeight(
				Math.min(keyboardUpHeight, window.visualViewport.height)
			);
			if ((layout != null) && cyRef.current !== null && cyRef.current.elements !== null) {
				layout.run();
				cyRef.current.fit(cyRef.current.elements());
				refreshParticles();
			}
		}, 75);
	};

	var layout = null;

	function isOnBestPath(edgeID) {
		if (bestPath == null) {
			return false;
		}
		for (
			var edgeIndex = 1;
			edgeIndex < bestPath.path.length;
			edgeIndex += 2
		) {
			const edgeOnBestPath = bestPath.path[edgeIndex]._private.data;
			if (edgeOnBestPath.id === edgeID) {
				return true;
			}
		}
		return false;
	}

	function getLineColor(edgeID) {
		const parts = edgeID.split("-");
		const filmID = parts[0];
		const actorID = parts[1];
		const onBestPath = isOnBestPath(edgeID);
		const isHint =
			(hintsUsed.has(actorID) &&
				hintsUsed.get(actorID)["source"] === filmID) ||
			(hintsUsed.has(filmID) &&
				hintsUsed.get(filmID)["source"] === actorID);
		return isHint ? "#5E51AE" : onBestPath ? "#BCA356" : "#fff";
	}

	function genElements(newNode) {
		const elements = [];

		const xs = [];
		const ys = [];
		var newX = 0;
		var newY = 0;
		if (newNode != null) {
			if (newNode.id === -3) {
				newNode.neighbourIDs = [-1, -2];
			}
			newNode.neighbourIDs.forEach(nid => {
				const neighbourID =
					newNode.type === "film" ? `a${nid}` : `f${nid}`;
				const pos = cyRef.current.getElementById(neighbourID).position();
				xs.push(pos["x"]);
				ys.push(pos["y"]);
			});
			newX = xs.reduce((a, b) => a + b) / xs.length;
			newY = ys.reduce((a, b) => a + b) / ys.length;
			if (xs.length === 1) {
				while (newX === xs[0] && newY === ys[0]) {
					newX = getRandomItemFromArray([
						xs[0] + 75,
						xs[0],
						xs[0] - 75
					]);
					newY = getRandomItemFromArray([
						ys[0] - 100,
						ys[0],
						ys[0] + 100
					]);
				}
			}
		}

		for (var actorKey in foundActors) {
			const tempKey = actorKey;
			foundActors[actorKey].forEach(actor => {
				const actorDetails = lookupNodeInMap(
					answersActors,
					actor.id,
					tempKey
				);
				if (actorDetails) {
					const nodeID = "a" + actor.id;
					// const isStart = actor.id === props.gameInitData.start.id || actor.id === props.gameInitData.end.id;
					const element = {
						data: {
							id: nodeID,
							key: tempKey,
							label: actorDetails.name,
							image:
								actor.id > 0
									? getTMDBImage(
											actorDetails.profile_path,
											"lg"
									  )
									: actorDetails.profile_path,
							imageCrossorigin: 'use-credentials',
							shape: "rectangle",
							borderColor: hintsUsed.has(nodeID)
								? "#5E51AE"
								: "#fff",
							backgroundColor: "#fff",
							opacity: 1,
							borderWidth: 1
						},
						selected: selectedNode && nodeID === selectedNode.id
					};
					if (
						newNode != null &&
						newNode.type === "actor" &&
						newNode.id === actor.id
					) {
						element["position"] = {
							x: newX,
							y: newY
						};
					}
					elements.push(element);
				}
			});
		}
		for (var filmKey in foundFilms) {
			const tempKey = filmKey;
			foundFilms[filmKey].forEach(film => {
				const filmDetails = lookupNodeInMap(
					answersFilms,
					film.id,
					tempKey
				);
				if (filmDetails) {
					const nodeID = "f" + film.id;
					const element = {
						data: {
							id: nodeID,
							key: tempKey,
							label: filmDetails.title,
							image:
								film.id > 0
									? getTMDBImage(
											filmDetails.poster_path,
											"lg"
									  )
									: filmDetails.poster_path,
							imageCrossorigin: 'use-credentials',
							shape: "rectangle",
							borderColor: hintsUsed.has(nodeID)
								? "#5E51AE"
								: "#fff",
							backgroundColor: "#fff",
							borderWidth: 1,
							opacity: 1
						},
						selected: selectedNode && nodeID === selectedNode.id
					};
					if (
						newNode != null &&
						newNode.type === "film" &&
						newNode.id === film.id
					) {
						element["position"] = {
							x: newX,
							y: newY
						};
					}
					elements.push(element);
				}
				Object.values(film["cast"]).forEach(actorList => {
					actorList.forEach(actor => {
						const actorNode = lookupNodeInMap(
							foundActors,
							actor.id,
							toGraphKey(actor.name)
						);
						if (actorNode) {
							const onBestPath = isOnBestPath(
								`f${film.id}-a${actorNode.id}`
							);
							const edgeID = `f${film.id}-a${actorNode.id}`;
							elements.push({
								data: {
									id: edgeID,
									source: `f${film.id}`,
									target: `a${actorNode.id}`,
									label: "",
									lineColor: getLineColor(edgeID),
									width: onBestPath ? 5 : 1
								}
							});
						}
					});
				});
			});
		}
		return elements;
	}

	const [elements, setElements] = useState(genElements(null));

	useEffect(() => {
		window.onbeforeunload = function(e) {
			return "Are you sure you want to leave? Your game will not be saved.";
		};
		return function cleanup() {
			window.onbeforeunload = null;
		};
	});

	const refreshParticles = () => {
		if (constellationBackgroundRef.current != null) {
			props.refreshLayoutConfig();
			constellationBackgroundRef.current.forceUpdate();
		}
	};

	const handleScroll = () => {
		if (mobileKeyboardActive) {
			window.scrollTo(0, 0);
		}
	};

	useEffect(() => {
		window.addEventListener("resize", handleWindowSizeChange);
		window.addEventListener("resize", refreshParticles);
		window.addEventListener("scroll", handleScroll);
		return function cleanup() {
			window.removeEventListener("resize", refreshParticles);
			window.removeEventListener("resize", handleWindowSizeChange);
			window.removeEventListener("scroll", handleScroll);
		};
	});

	let isMobile = width <= 768;

	useEffect(() => {
		if (onMount) {
			window.scrollTo(0, 0);
			document.body.scrollTop = 0;
			props.refreshLayoutConfig();
			setOnMount(false);
		}
	}, [onMount, props]);

	useEffect(() => {
		if (successModalVisible) {
			setSuccessModalPayload(successModalVisible);
		} else {
			setTimeout(() => setSuccessModalPayload(null), 100);
		}
	}, [successModalVisible]);

	useEffect(() => {
		if (showSuggestion) {
			setSpellSuggest(showSuggestion);
		} else {
			setTimeout(() => setSpellSuggest(null), 100);
		}
	}, [showSuggestion]);

	useEffect(() => {
		if (layout != null && refreshLayout === true) {
			setTimeout(function() {
				layout.run();
			}, 75);
			setRefreshLayout(false);
		}
	}, [layout, refreshLayout]);

	useEffect(() => {
		const alwaysFocusInput = window.setInterval(() => {
			if (
				!isMobile &&
				inputRef.current != null &&
				inputRef.current.focus != null &&
				successModalPayload == null
			) {
				inputRef.current.focus();
			}
		}, 500);
		return function cleanup() {
			window.clearInterval(alwaysFocusInput);
		};
	});

	useEffect(() => {
		handleWindowSizeChange();
	}, [mobileKeyboardActive]);

	useEffect(() => {
		if (isMobile && inputRef.current.blur != null) {
			inputRef.current.blur();
		}
	}, [successModalPayload]);

	const handleSelectedNode = () => {
		const selected = cyRef.current.$("node:selected");
		const nodeKey = nodeToKey(selected);
		setSelectedNode({id: nodeKey.id, key: nodeKey.key});
	};

	const handleUnselectedNode = () => {
		setSelectedNode(null);
		const selected = cyRef.current.$("node:selected");
		selected.unselect();
	};

	const setSelectedNodeFromOutsideGraph = node => {
		cyRef.current.$("node:selected").unselect();
		const nodeID = node.type === "film" ? `f${node.id}` : `a${node.id}`;
		cyRef.current.getElementById(nodeID).select();
	};

	const afterSuccess = nodeToSelect => {
		setElements(genElements(nodeToSelect));
		setRefreshLayout(true);

		if (nodeToSelect.id > 0) {
			const imageLoader = new Image();
			imageLoader.src = getTMDBImage(nodeToSelect.image_path, "lg");
			imageLoader.onload = () => {
				setSelectedNodeFromOutsideGraph(nodeToSelect);
			};
		} else {
			setSelectedNodeFromOutsideGraph(nodeToSelect);
		}

		const dijkstra = cyRef.current.elements()
			.dijkstra({root: `#a${props.gameInitData.start.id}`});
		const distanceToEnd = dijkstra.distanceTo(
			`#a${props.gameInitData.end.id}`
		);
		const pathToEnd = dijkstra.pathTo(`#a${props.gameInitData.end.id}`);

		if (distanceToEnd !== Infinity) {
			if (bestPath == null || distanceToEnd < bestPath.distance) {
				setSuccessModalVisible({
					path: pathToList(pathToEnd, answersFilms, answersActors),
					start: props.gameInitData.start.name,
					end: props.gameInitData.end.name,
					confetti: true
				});
				setBestPath({path: pathToEnd, distance: distanceToEnd});
				cyRef.current
					.$("edge")
					.data("width", 1)
					.data("lineColor", "#fff");
				for (
					var edgeIndex = 1;
					edgeIndex < pathToEnd.length;
					edgeIndex += 2
				) {
					const edgeOnBestPath = pathToEnd[edgeIndex]._private.data;
					cyRef.current
						.getElementById(edgeOnBestPath.id)
						.data("lineColor", "#BCA356")
						.data("width", 5);
				}
				for (let [key, value] of hintsUsed) {
					const edgeID =
						key[0] === "f"
							? `${key}-${value.source}`
							: `${value.source}-${key}`;
					cyRef.current
						.getElementById(edgeID)
						.data("lineColor", getLineColor(edgeID));
				}
			}
		}
	};

	const updateMapsWithNewCast = (
		setFoundMap,
		setAnswersMap,
		foundMap,
		nodeType,
		data,
		key,
		node
	) => {
		let cast = data.credits.cast;
		cast = cast.filter(o =>
			nodeType === "film"
				? o.profile_path != null
				: shouldFilterFilm(o)
		);
		setFoundMap(prevState => {
			const newNode =
				nodeType === "film"
					? {id: data.id, cast: castArrayToDict(cast)}
					: {id: data.id, credits: creditsArrayToDict(cast)};
			insertNodeToMap(prevState, newNode, key);
			return prevState;
		});

		const answerNameKey = nodeType === "film" ? "name" : "title";
		const neighbourIDs = [];

		setAnswersMap(prevState => {
			cast.forEach(c => {
				// doing two things in this loop

				// #1 update answers map
				const answerNode =
					nodeType === "film"
						? parseActorDetails(c)
						: parseFilmDetails(c);
				const answerKey = toGraphKey(answerNode[answerNameKey]);
				if (!lookupNodeInMap(prevState, answerNode.id, answerKey)) {
					insertNodeToMap(prevState, answerNode, answerKey);
				}

				// #2 populate neighbours
				const neighbour = lookupNodeInMap(
					foundMap,
					answerNode.id,
					answerKey
				);
				if (neighbour) {
					neighbourIDs.push(answerNode.id);
				}
			});
			return prevState;
		});

		const nodeNameKey = nodeType === "film" ? "title" : "name";
		const imagePath = nodeType === "film" ? "poster_path" : "profile_path";

		afterSuccess({
			type: nodeType,
			key: toGraphKey(node[nodeNameKey]),
			id: node.id,
			image_path: node[imagePath],
			neighbourIDs: neighbourIDs
		});
	};

	const nodeMapToFlatArr = nodeMap => {
		const arr = [];
		/* eslint-disable-next-line */
		Object.keys(nodeMap).map(k => {
			nodeMap[k].forEach(v => {
				arr.push({mapKey: k, ...v});
			});
		});
		return arr;
	};

	const executeSpellSuggest = guessKey => {
		const answersFilmsArr = nodeMapToFlatArr(answersFilms);
		const foundFilmIDs = nodeMapToFlatArr(foundFilms).map(f => f.id);
		const unfoundFilms = answersFilmsArr.filter(
			f => !foundFilmIDs.includes(f.id)
		);

		const answersActorsArr = nodeMapToFlatArr(answersActors);
		const foundActorIDs = nodeMapToFlatArr(foundActors).map(a => a.id);
		const unfoundActors = answersActorsArr.filter(
			a => !foundActorIDs.includes(a.id)
		);

		const alternateTitlesArr = nodeMapToFlatArr(alternateTitles);
		const unfoundAlternateTitles = alternateTitlesArr.filter(
			t => !foundFilmIDs.includes(t.id)
		);

		const allUnfoundKeys = unfoundFilms
			.concat(unfoundActors)
			.concat(unfoundAlternateTitles);
		const fuzzy = FuzzySet(allUnfoundKeys.map(o => o.mapKey));
		const result = fuzzy.get(guessKey, null, 0.8);
		if (result != null && result != guessKey) {
			const suggestion = allUnfoundKeys.filter(
				o => o.mapKey === result[0][1]
			)[0];
			if (unfoundFilms.some(o => o.mapKey === suggestion.mapKey)) {
				setShowSuggestion(suggestion.title);
			} else if (
				unfoundActors.some(o => o.mapKey === suggestion.mapKey)
			) {
				setShowSuggestion(suggestion.name);
			} else if (
				unfoundAlternateTitles.some(o => o.mapKey === suggestion.mapKey)
			) {
				const suggestions = unfoundFilms.filter(
					f => f.mapKey === suggestion.key
				);
				if (suggestions.length > 0) {
					setShowSuggestion(suggestions[0].title);
				}
			}
		}
	};

	const checkGuess = (guess, onCorrect) => {
		const onComplete = () => {
			if (fuzzyCheckTimeout != null) {
				clearTimeout(fuzzyCheckTimeout);
			}
			setShowSuggestion(null);
		};
		const onIncorrect = () => {
			setFuzzyCheckTimeout(
				setTimeout(() => executeSpellSuggest(key), 400)
			);
		};
		const key = toGraphKey(guess);
		if (key in alternateTitles) {
			alternateTitles[key].forEach(fullTitle => {
				checkGuess(fullTitle.key, onCorrect);
			});
		}
		const hintIcon = (
			<img
				style={{marginRight: 10, marginTop: -1}}
				alt="New Hint"
				src={NewHint}
			/>
		);
		if (
			key in answersFilms &&
			(!(key in foundFilms) ||
				answersFilms[key].length > foundFilms[key].length)
		) {
			answersFilms[key]
				.filter(f => {
					if (key in foundFilms) {
						return !foundFilms[key].map(g => g.id).includes(f.id);
					}
					return true;
				})
				.forEach(film => {
					if (film.id < 0) {
						setTimeout(() => {
							updateMapsWithNewCast(
								setFoundFilms,
								setAnswersActors,
								foundActors,
								"film",
								{
									cast: [
										{
											id: -1,
											name: "Eric Bai",
											profile_path: ""
										},
										{
											id: -2,
											name: "Amanda Hum",
											profile_path: ""
										}
									],
									id: -3
								},
								key,
								film
							);
						}, 100);
						return;
					}
					getFilmCredits(film)
						.then(function(response) {
							if (
								response.data.belongs_to_collection &&
								props.cannotUseSeries
							) {
								setAnswersFilms(prevState => {
									const answerKey = toGraphKey(
										response.data.title
									);
									removeNodeFromMap(
										prevState,
										film,
										answerKey
									);
									return prevState;
								});
								message.error({
									content: "Film cannot belong to a series",
									className: "message lobby-error",
									icon: (
										<ExclamationCircleFilled
											style={{color: "#fff"}}
										/>
									),
									key: "no-match"
								});
								onIncorrect();
								return;
							}
							const isHint = hintsUsed.has(`f${film.id}`);
							message.destroy("no-match");
							message.success({
								content: `New Movie: ${film.title}`,
								className: `message game-message ${
									isHint ? "hint-message" : ""
								}`,
								icon: isHint ? (
									hintIcon
								) : (
									<img
										style={{
											marginRight: 10,
											marginTop: 4,
											marginBottom: 4
										}}
										alt="New Movie"
										src={NewMovie}
									/>
								)
							});
							keywords.set(film.id, response.data.keywords.keywords.map(o => o.name));
							setKeywords(keywords);
							updateMapsWithNewCast(
								setFoundFilms,
								setAnswersActors,
								foundActors,
								"film",
								response.data,
								key,
								film
							);
							onCorrect();
							onComplete();
						})
						.catch(function(error) {
							// TODO how to handle this error?
						});
				});
		} else if (
			key in answersActors &&
			(!(key in foundActors) ||
				answersActors[key].length > foundActors[key].length)
		) {
			answersActors[key]
				.filter(a => {
					if (key in foundActors) {
						return !foundActors[key].map(b => b.id).includes(a.id);
					}
					return true;
				})
				.forEach(actor => {
					const isHint = hintsUsed.has(`a${actor.id}`);
					message.destroy("no-match");
					message.success({
						content: `New Star: ${actor.name}`,
						className: `message game-message ${
							isHint ? "hint-message" : ""
						}`,
						icon: isHint ? (
							hintIcon
						) : (
							<img
								style={{marginRight: 10, marginTop: -1}}
								alt="New Star"
								src={NewActor}
							/>
						)
					});
					getActorCredits(actor)
						.then(function(response) {
							updateMapsWithNewCast(
								setFoundActors,
								setAnswersFilms,
								foundFilms,
								"actor",
								response.data,
								key,
								actor
							);
							const filmsToGetAlternates = response.data.credits.cast.map(
								f => {
									return {id: f.id, title: f.title};
								}
							);
							updateAlternateTitles(
								filmsToGetAlternates,
								alternateTitles,
								alt => setAlternateTitles(alt)
							);
							onComplete();
							onCorrect();
						})
						.catch(function(error) {
							// TODO how to handle this error?
						});
				});
		} else {
			onComplete();
			onIncorrect();
		}
	};

	const numToWordGuess = guess => {
		const numToWordStrArr = guess.split(" ");
		var containsNumber = false;
		for (var i = 0; i < numToWordStrArr.length; i++) {
			const int = parseInt(numToWordStrArr[i]);
			if (Number.isSafeInteger(int)) {
				containsNumber = true;
				numToWordStrArr[i] = numToWords(int);
			}
		}
		if (containsNumber) {
			const guessWithNumAsWord = numToWordStrArr.join(" ");
			return guessWithNumAsWord;
		}
		return null;
	};

	const smartCheckGuess = guess => {
		const numToWordGuesses = numToWordGuess(guess);

		const guessList = [guess, numToWordGuesses].filter(g => g != null);
		for (var i = 0; i < guessList.length; i++) {
			checkGuess(guessList[i], () => {
				setGuess("");
			});
		}
	};

	const addFilmForActorHint = actor => {
		const mostPopularFilms = Object.values(actor.credits)
			.flat()
			.sort((f1, f2) => f2.vote_count - f1.vote_count);
		const firstUnfound = mostPopularFilms.find(
			f => !lookupNodeInMap(foundFilms, f.id, toGraphKey(f.title))
		);
		if (firstUnfound === undefined) {
			message.destroy("no-match");
			message.error({
				content: "No film found",
				className: "message lobby-error",
				icon: <ExclamationCircleFilled style={{color: "#fff"}} />,
				key: "no-match"
			});
			return;
		}
		hintsUsed.set(`f${firstUnfound.id}`, {source: `a${actor.id}`});
		setHintsUsed(hintsUsed);
		checkGuess(firstUnfound.title);
	};

	const addActorForFilmHint = film => {
		const topActors = Object.values(film.cast).flat();
		const firstUnfound = topActors.find(
			a => !lookupNodeInMap(foundActors, a.id, toGraphKey(a.name))
		);
		if (firstUnfound === undefined) {
			message.destroy("no-match");
			message.error({
				content: "No actor found",
				className: "message lobby-error",
				icon: <ExclamationCircleFilled style={{color: "#fff"}} />,
				key: "no-match"
			});
			return;
		}
		hintsUsed.set(`a${firstUnfound.id}`, {source: `f${film.id}`});
		setHintsUsed(hintsUsed);
		checkGuess(firstUnfound.name);
	};

	const onPressEnter = () => {
		if (guess === "") {
			return;
		}
		if (spellSuggest != null) {
			setShowSuggestion(null);
			setGuess("");
			checkGuess(spellSuggest);
			return;
		}
		executeSpellSuggest(toGraphKey(guess));
		message.destroy("no-match");
		message.error({
			content: "No match found",
			className: "message lobby-error",
			icon: (
				<ExclamationCircleFilled
					style={{color: "#fff"}}
				/>
			),
			key: "no-match"
		});
	};

	const guessInputRow = (
		<Row className="game-row guess-row">
			<Col className="guess-col" lg={12} md={12} sm={12} xs={12}>
				<Popover
					overlayClassName="spell-suggest-popover"
					placement="topLeft"
					content={
						<div
							style={{
								display: "flex",
								textAlign: "center",
								justifyContent: "center"
							}}
						>
							<Col
								style={{
									flexGrow: 1,
									display: "flex",
									flexDirection: "column",
									justifyContent: "center"
								}}
							>
								<span>{`Did you mean "${spellSuggest}"?`}</span>
							</Col>
							<Col style={{flexShrink: 0}}>
								<Button
									style={{marginLeft: 12}}
									ghost
									onClick={() => {
										setShowSuggestion(null);
										checkGuess(spellSuggest, () => {
											setGuess("");
										});
									}}
								>
									<span>Yes</span>
									<img
										style={{marginLeft: 8, marginTop: -1}}
										src={Enter}
										alt="Enter"
									/>
								</Button>
							</Col>
						</div>
					}
					visible={showSuggestion && guess.length > 0}
				>
					<Input
						ref={inputRef}
						onFocus={
							isMobile && !successModalPayload
								? elem => {
										setMobileKeyboardActive(true);
										setTimeout(() => {
											window.scrollTo(0, 0);
											document.body.scrollTop = 0;
										}, 75);
								  }
								: null
						}
						onBlur={
							isMobile
								? elem => {
										setMobileKeyboardActive(false);
								  }
								: null
						}
						onPressEnter={onPressEnter}
						className="guess-input"
						placeholder={
							Object.keys(foundFilms).length === 0
								? `Name a movie with ${props.gameInitData.start.name} or ${props.gameInitData.end.name}...`
								: "Guess a movie or actor..."
						}
						size="large"
						onChange={event => {
							const value = event.target.value;
							setShowSuggestion(null);
							setGuess(value);
							smartCheckGuess(value);
						}}
						disabled={false}
						value={guess}
					/>
				</Popover>
			</Col>
		</Row>
	);

	return (
		<Layout
			style={{
				width: "100%",
				display: "flex",
				flexDirection: "coloumn",
				flexWrap: "nowrap",
				flexGrow: 1,
				height: mobileKeyboardActive ? keyboardUpHeight : height,
				padding:
					"env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)"
			}}
		>
			<Content
				style={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "coloumn",
					flexWrap: "nowrap",
					position: "relative"
				}}
			>
				<div className="graph-body">
					<div
						className="frame-layout__particles-container"
						style={{zIndex: 0}}
					>
						{successModalPayload == null ||
						!successModalPayload.confetti ? (
							<Particles
								options={props.particlesConfig}
								className="frame-layout__particles"
								ref={constellationBackgroundRef}
							/>
						) : null}
					</div>
					<div
						style={{
							position: "absolute",
							top: 18,
							left: 18,
							zIndex: 2
						}}
					>
						<BackButton goBack={props.goBack} />
					</div>

					<div
						style={{
							position: "absolute",
							top: 18,
							right: 18,
							zIndex: 2
						}}
					>
						{props.howToPlayButton}
					</div>
					<div
						style={{
							flexShrink: 0,
							display: "flex",
							flexDirection: "row",
							flexWrap: "nowrap",
							textAlign: "center",
							padding: "18px 58px 0px"
						}}
					>
						<div
							style={{
								flexGrow: 1,
								textAlign: "center",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center"
							}}
						>
							<Button type="link" className="game-header">
								<img
									className="in-game-logo"
									src={Logo}
									alt="Logo"
								/>
								<h1
									className="unselectable game-title"
									style={{color: "#fff", marginBottom: 0}}
								>
									{"Connect the Stars"}
								</h1>
							</Button>
							<Button
								style={{marginTop: 8}}
								type="link"
								className="game-header"
							>
								<h3 className="unselectable">
									{/* eslint-disable-next-line */}
									Can you connect{" "}
									<a
										href="#"
										onClick={() => {
											setSelectedNodeFromOutsideGraph(
												props.gameInitData.start
											);
										}}
									>
										{props.gameInitData.start.name}
									</a>{" "}
									and{" "}
									<a
										href="#"
										onClick={() => {
											setSelectedNodeFromOutsideGraph(
												props.gameInitData.end
											);
										}}
									>
										{props.gameInitData.end.name}
									</a>
									?
								</h3>
							</Button>
						</div>
					</div>
					<div
						style={{
							flexGrow: 1,
							width: "100%",
							display: "flex",
							flexDirection: "coloumn",
							flexWrap: "nowrap"
						}}
					>
						<CytoscapeComponent
							cy={cy => {
								cyRef.current = cy
								cy.on("select", "node", function(event) {
									clearTimeout(cy.nodesSelectionTimeout);
									cy.nodesSelectionTimeout = setTimeout(
										handleSelectedNode,
										100
									);
								});
								cy.on("tapunselect", "node", function(event) {
									clearTimeout(cy.nodesSelectionTimeout);
									cy.nodesSelectionTimeout = setTimeout(
										handleUnselectedNode,
										100
									);
								});
								layout = cy.layout(props.layoutConfig);
							}}
							elements={elements}
							style={{width: "100%", flexGrow: 1}}
							layout={props.layoutConfig}
							maxZoom={3}
							minZoom={0.6}
							stylesheet={CYTOSCAPE_STYLESHEET}
						/>
						{selectedNode && (
							<SelectedNode
								selectedNode={selectedNode}
								isFromHint={hintsUsed.has(selectedNode.id)}
								foundActors={foundActors}
								foundFilms={foundFilms}
								answersFilms={answersFilms}
								answersActors={answersActors}
								setSelectedNode={
									setSelectedNodeFromOutsideGraph
								}
								handleUnselectedNode={handleUnselectedNode}
								addFilmForActorHint={addFilmForActorHint}
								addActorForFilmHint={addActorForFilmHint}
								cannotUseSeries={props.cannotUseSeries}
							/>
						)}
						<div
							style={{position: "absolute", bottom: 17, left: 18}}
						>
							<Button
								size="large"
								className="icon-btn btn-on-stars"
								icon={<img alt="Re-center" src={Compass} />}
								onClick={() => {
									layout.run();
									cyRef.current.fit(cyRef.current.elements());
								}}
							/>
						</div>
						<div
							className="hint-box"
							style={{
								position: "absolute",
								bottom: 8,
								right: 18,
								paddingRight: "-8px"
							}}
						>
							<GuideText />
						</div>
					</div>
				</div>
				{successModalPayload && successModalPayload.confetti ? (
					<WinnerBackdrop style={{zIndex: 2}} />
				) : null}
			</Content>
			<Footer
				className="game-footer"
				style={{
					width: "100%",
					flexShrink: 0
				}}
			>
				<Grid fluid style={{padding: 0}}>
					{guessInputRow}
					{!isMobile && (
						<StatsGrid
							starsFound={Object.keys(foundActors).length}
							filmsFound={Object.keys(foundFilms).length}
							isMobile={isMobile}
							bestPath={bestPath}
							onBestPathButtonClick={() =>
								setSuccessModalVisible({
									path: pathToList(
										bestPath.path,
										answersFilms,
										answersActors
									),
									start: props.gameInitData.start.name,
									end: props.gameInitData.end.name,
									confetti: false
								})
							}
						/>
					)}
				</Grid>
				<SuccessModal
					modalPayload={successModalPayload}
					visible={successModalVisible}
					onCancel={() => {
						setSuccessModalVisible(null);
					}}
					goBack={props.goBack}
					numHintsUsed={hintsUsed.size}
					keywords={keywords}
				/>
			</Footer>
		</Layout>
	);
}

export default Game;
