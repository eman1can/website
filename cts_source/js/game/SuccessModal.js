import React, {useState, useEffect} from "react";

import {Button, message, Modal} from "antd";

import Trophy from "../assets/trophy.svg";
import Close from "../assets/close.svg";

import {copyTextToClipboard} from "../util";

function getCheatMovie(path) {
	const cheatMovieIDs = [
		8079 // Om Shanti Om
	];
	for (const movieID of cheatMovieIDs) {
		const foundCheat = path.find(
			node => node.type === "film" && node.id === movieID
		);
		if (foundCheat != null) {
			return foundCheat.title;
		}
	}
	return null;
}


const GENRE_EMOJIS = [
	{id: 37, emoji: '🤠'}, // western
	{id: 10752, emoji: '🪖'}, // war
	{id: 16, emoji: '🎨'}, // animation
	{id: 'anime', emoji: '🎨'},
	{id: 10402, emoji: '🎶'}, // music
	{id: 'musical', emoji:'🎶'},
	{id: 'superhero', emoji: '🦸‍♂️'},
	{id: 'dc comics', emoji: '🦸‍♂️'},
	{id: 'marvel cinematic universe (mcu)', emoji: '🦸‍♂️'},
	{id: 'pirate', emoji: '🏴‍☠️'},
	{id: 'kung fu', emoji: '🥋'},
	{id: 'ghost', emoji: '👻'},
	{id: 'vampire', emoji: '🧛🏻‍♂️'},
	{id: 'zombie', emoji: '🧟‍♂️'},
	{id: 'halloween', emoji: '🎃'},
	{id: 'magic', emoji:'🪄'},
	{id: 27, emoji: '😱'}, // horror
	{id: 9648, emoji: '🔍'}, // mystery
	{id: 'space opera', emoji: '🛸'},
	{id: 'time travel', emoji: '⏳'},
	{id: 'dream', emoji: '💭'},
	{id: 'heist', emoji: '💰'},
	{id: 'wall street', emoji: '💰'},
	{id: 'alien', emoji: '👽'},
	{id: 'video game', emoji: '👾'},
	{id: 'sports', emoji: '🏅'},
	{id: 'high school', emoji: '🎒'},
	{id: 'spy', emoji: '🔫'},
	{id: 'hitman', emoji: '🔫'},
	{id: 'gangster', emoji: '🔫'},
	{id: 'assassin', emoji: '🔫'},
	{id: 'buddy cop', emoji: '🚓'},
	{id: 'fashion', emoji: '👠'},
	{id: 'journalism', emoji: '📰'},
	{id: 878, emoji: '🛸'}, // science fiction
	{id: 14, emoji: '🐉'}, // fantasy
	{id: 36, emoji: '📖'}, // history
	{id: 53, emoji: '🔪'}, // thriller
	// generic genres
	{id: 99, emoji: '🎥'}, // documentary
	{id: 10751, emoji: '👪'}, // family
	{id: 80, emoji: '⛓'}, // crime
	{id: 10749, emoji: '💞'}, // romance
	{id: 35, emoji: '🤣'}, // comedy
	{id: 28, emoji: '💥'}, // action
	{id: 12, emoji: '🏔'}, // adventure
	{id: 18, emoji: '🎭'}, // drama
	{id: 10770, emoji: '📺'}, // tv movie
];
// potential keywords: mafia, mobster, space,


function getFilmEmoji(film, keywords) {
	const keywordsAndGenres = keywords.concat(film.genres);
	for (const g of GENRE_EMOJIS) {
		if (keywordsAndGenres.includes(g.id)) {
			return g.emoji;
		}
	}
	return '🍿';
}

function pathToEmoji(path, keywords, hideSpoilers = false) {
	const emojiList = path.map((node, index) => {
		const firstOrLast = index === 0 || index === path.length - 1;
		if (node.type === "actor"){
			if (!hideSpoilers) {
				if (firstOrLast) {
					return "⭐️ " + node.name;
				}
				return node.name;
			}
			if (index === 0) {
				return "⭐️ " + node.name + '\n';
			}
			if (index === path.length - 1) {
				return '\n⭐️ ' + node.name;
			}
			return null;
		} else {
			const emoji = getFilmEmoji(node, keywords.get(node.id));
			if (hideSpoilers && !firstOrLast) {
				return emoji;
			}
			return emoji + " " + node.title;
		}
	});
	return emojiList.filter(o => o != null);
}

function SuccessModal(props) {
	const {modalPayload, visible, onCancel, goBack, keywords} = props;
	const [cheatMovie, setCheatMovie] = useState(null);

	const emojiPath = modalPayload ? pathToEmoji(modalPayload.path, keywords) : [];
	const unencodedEmojiMessage = modalPayload ? `Connect the Stars\n\n${pathToEmoji(modalPayload.path, keywords, true).join("▶️")}\n\n` : "";

	useEffect(() => {
		if (modalPayload) {
			setCheatMovie(getCheatMovie(modalPayload.path));
		}
	}, [modalPayload]);

	return (
		<Modal
			closeIcon={<img alt="Close" src={Close} />}
			className={
				modalPayload && modalPayload.confetti === true
					? "success-modal"
					: "success-modal-blue"
			}
			visible={visible}
			mask={true}
			maskStyle={
				modalPayload &&
				modalPayload.confetti === true && {
					background:
						"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(188,163,86,0.5) 100%)",
					backgroundColor: null
				}
			}
			onCancel={onCancel}
			centered
			width={600}
			footer={null}
		>
			<div>
				<div className="success-modal-section">
					<img
						src={Trophy}
						style={{marginTop: 24, marginBottom: 30, height: 50}}
						alt="Trophy"
					/>
					<p className="modal-subtitle">- Your Shortest Path -</p>
						<div className="success-modal-path-text">
							{emojiPath.map(node => <p style={{marginBottom: 0}}>{node}</p>)}
						</div>
					{props.numHintsUsed > 0 && (
						<p style={{marginTop: 8}} className="success-modal-path-text">
							{`Hints used: ${props.numHintsUsed}`}
						</p>
					)}
					{cheatMovie != null && (
						<p style={{marginTop: 8}} className="success-modal-path-text">
							{`Next time try winning without ${cheatMovie}!`}
						</p>
					)}
				</div>
				<div className="success-modal-section">
					<Button
						ghost
						type="primary"
						onClick={() => {
							if (navigator.share) {
								navigator
							    .share({
							        text: unencodedEmojiMessage,
							        url: window.location.href
							    })
							    .then(() => {})
							    .catch(err => {});
							} else {
								copyTextToClipboard(unencodedEmojiMessage + window.location.href);
								message.destroy("copied");
								message.success({
									content: "Copied to clipboard",
									className: "message game-message",
									icon: <div/>,
									key: 'copied'
								});
							}

						}
					}
				>
					Share
				</Button>
				</div>
				{modalPayload && modalPayload.confetti && (
					<div
						className="success-modal-section"
						style={{marginTop: 55, marginBottom: 24}}
					>
						<Button
							style={{marginRight: 24}}
							ghost
							type="primary"
							onClick={goBack}
						>
							New Game
						</Button>
						<Button ghost type="primary" onClick={onCancel}>
							Continue
						</Button>
					</div>
				)}
			</div>{" "}
		</Modal>
	);
}

export default SuccessModal;
