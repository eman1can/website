import { find } from "../../utils";
import { GameType, Dict, GameData, Path } from "../types";
import { Film } from "../api/types";
import { ArrowRightOutlined, DownloadOutlined } from "@ant-design/icons";
import Button from "../../elements/Button";
import React, { useState } from "react";
import { readLocalStorage } from "../local_storage";
import { message } from "antd";
import { copyTextToClipboard } from "../api/utils";
import { downloadFile, showAlert } from "../utils";

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

function getFilmEmoji(film: Film | null) {
    if (film == null)
        return '🍿';
    let keywords: Array<string | number> = film.keywords;
    keywords = keywords.concat(film.genres);
    for (const g of GENRE_EMOJIS) {
        if (keywords.includes(g.id)) {
            return g.emoji;
        }
    }
    return '🍿';
}

function createShareMessage(data: GameData, bestPath: Path, spoilers: boolean) {
    return "Connect The Stars\n\n" + bestPath.path.map(p => {
        const items = p.map((n, nodeIx) => {
            const name = data.pool[n].name;
            if (Object.values(data.requires).includes(n)) {
                if (spoilers)
                    return nodeIx === 0 ? `⭐️ ${name}` : `⭐️ ${name}`;
                return nodeIx === 0 ? `⭐️ ${name}\n` : `\n⭐️ ${name}`;
            }
            if (n.startsWith('a')) {
                if (spoilers)
                    return `    ${name}`;
                return null;
            } else {
                if (spoilers)
                    return `${getFilmEmoji(data.pool[n])} ${name}`
                return getFilmEmoji(data.pool[n]);
            }
        }).filter(o => o !== null);
        if (spoilers)
            return items.join('\n');
        return items.join("▶️");
    }).join('\n\n') + `\n\nScore: ${bestPath.distance}\n` + (bestPath.hintsUsed > 0 ? `HintsUsed: ${bestPath.hintsUsed}\n` : '');
}

function oldShare(shareMessage: string) {
    copyTextToClipboard(shareMessage + window.location.href, () => {
        showAlert('copied', 'Copied to clipboard', <div/>);
    }, () => {
        showAlert('copied', 'Failed to write to clipboard', <div/>);
    });
}

// TODO: Add spoilers button
const SuccessModal = () => {
    const [spoilers, setSpoilers] = useState<boolean>(false);
    const data = readLocalStorage<GameData | null>('game_data', null);
    if (!data)
        return <div/>;

    const bestPath = data.bestPath;
    if (!bestPath)
        return <div/>;

    // TODO: Add confetti

    return (<div className={bestPath.first ? 'success-modal col' : 'success-modal-blue col'} style={{flexGrow: 1}}>
        <div className="success-modal-section col" style={{flexGrow: 1}}>
            <img
                src={find('assets/cts/icon', 'trophy.svg')}
                className='success-modal-trophy'
                alt="Trophy"
            />
            <div className="modal-body akkurat" style={{marginBottom: '1em'}}>- Your Shortest Path -</div>
            <div className="modal-body akkurat" style={{marginBottom: '1em'}}>{bestPath.path.length > 1 ? `Total Distance: ${bestPath.distance}` : `- Distance: ${bestPath.distance} -`}</div>
            <div className="sleek-scroll col" style={{overflowY: 'auto', maxHeight: '500px', padding: '0 20px', flexGrow: 1, flexBasis: '10px'}}>
                {bestPath.path.map(p => {
                    console.log('Add element for ', p);
                    const stars = p.filter((o, ix) => o.startsWith('a'));
                    const films = p.filter((o, ix) => o.startsWith('f'));
                    console.log(stars, films);

                    return (<>
                        {bestPath.path.length > 1 ? <div className="modal-body akkurat">- Distance: {p.length - 1} -</div> : null}
                        <div className="success-modal-path-text akkurat" style={{marginBottom: '20px'}}>
                            <div>
                                {stars.map(s => <p className='modal-body success-modal-star'>{data.pool[s].name}</p>)}
                            </div>
                            <div  style={{margin: '0 15px'}}>
                                {films.map(f => <p className='modal-body success-modal-film'>{getFilmEmoji(data.pool[f])}</p>)}
                            </div>
                            <div>
                                {films.map(f => <p
                                    className='modal-body success-modal-film'>{data.pool[f].name}</p>)}
                            </div>
                        </div>
                    </>);
                })}
            </div>
        </div>
        <div className="success-modal-section row" style={{marginTop: '16px', gap: '16px', justifyContent: 'center'}}>
            <Button
                className={`btn-solid`}
                style={{maxWidth: '222px', flexGrow: 1}}
                onClick={() => {
                    const filename =`CTS-${data.mode}-` + Object.values(data.requires).map(id => data.pool[id].name).join('-') + '.json';
                    downloadFile(JSON.stringify(data), filename);
                }}
                icon={<DownloadOutlined/>}
            >
                Download
            </Button>
            <Button
                className={`btn-solid`}
                style={{maxWidth: '222px', flexGrow: 1}}
                onClick={() => {
                    const shareMessage = createShareMessage(data, bestPath, spoilers);

                    if (navigator.share) {
                        navigator.share({
                                text: shareMessage,
                                url: window.location.href
                            })
                            .then(() => {})
                            .catch(err => {
                                oldShare(shareMessage);
                            });
                    } else {
                        oldShare(shareMessage);
                    }
                }}
                iconRight={<ArrowRightOutlined/>}
            >
                Share
            </Button>
        </div>
    </div>);
}

export default SuccessModal;