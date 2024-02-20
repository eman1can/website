import {find} from "../utils";
import {GameType, Dict} from "../cts/types";
import {Film} from "../cts/api/types";
import {ArrowRightOutlined} from "@ant-design/icons";
import Button from "./Button";
import React from "react";

const GENRE_EMOJIS = [
    {id: 37, emoji: '🤠'}, // western
    {id: 10752, emoji: '🪖'}, // war
    {id: 16, emoji: '🎨'}, // animation
    {id: 'anime', emoji: '🎨'},
    {id: 10402, emoji: '🎶'}, // music
    {id: 'musical', emoji: '🎶'},
    {id: 'superhero', emoji: '🦸‍♂️'},
    {id: 'dc comics', emoji: '🦸‍♂️'},
    {id: 'marvel cinematic universe (mcu)', emoji: '🦸‍♂️'},
    {id: 'pirate', emoji: '🏴‍☠️'},
    {id: 'kung fu', emoji: '🥋'},
    {id: 'ghost', emoji: '👻'},
    {id: 'vampire', emoji: '🧛🏻‍♂️'},
    {id: 'zombie', emoji: '🧟‍♂️'},
    {id: 'halloween', emoji: '🎃'},
    {id: 'magic', emoji: '🪄'},
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

function getFilmEmoji(film: Film, keywords: Dict<string | number>) {
    const keywordsAndGenres = Object.values(keywords).concat(film.genres);
    for (const g of GENRE_EMOJIS) {
        if (keywordsAndGenres.includes(g.id)) {
            return g.emoji;
        }
    }
    return '🍿';
}

type ModalProps = {
    scale: string
    path: Array<GameType>
    hintsUsed: number
    confetti: boolean
    keywords: Dict<string | number>
}

export const getSuccessModal = (props: Readonly<ModalProps>) => {
    const stars = props.path.filter((o, ix) => (ix % 2) === 0);
    const films = props.path.filter((o, ix) => (ix % 2) === 1);

    console.log(stars, films);

    // const emojiPath = appendEmojis(props.path, props.keywords);
    const shareMessage = '';
    // const unencodedEmojiMessage = modalPayload ? `Connect the Stars\n\n${pathToEmoji(modalPayload.path, keywords, true).join("▶️")}\n\n` : "";

    return (<div className={props.confetti ? 'success-modal' : 'success-modal-blue'}>
        <div className="success-modal-section">
            <img
                src={find('assets/cts/icon', 'trophy.svg')}
                className='success-modal-trophy'
                alt="Trophy"
            />
            <p className="modal-body akkurat" style={{marginBottom: '1em'}}>- Your Shortest Path -</p>
            <div className="success-modal-path-text akkurat">
                <div>
                    {stars.map(s => <p className='modal-body success-modal-star'>{s.name}</p>)}
                </div>
                <div style={{marginLeft: '20px'}}>
                    {films.map(f => <p className='modal-body success-modal-film'>{getFilmEmoji(f, props.keywords)}{f.name}</p>)}
                </div>
            </div>
        </div>
        <div className="success-modal-section">
            <Button
                className={`btn-solid ${props.scale}`}
                onClick={() => {

                }}
                iconRight={<ArrowRightOutlined/>}
            >
                Share
            </Button>
        </div>
    </div>);
}