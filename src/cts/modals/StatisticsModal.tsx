import React from "react";
import { getProfileImage } from "../api/tmdb";
import { readLocalStorage } from "../local_storage";
import Button from "../../elements/Button";
import { Dict } from "../types";

type GameResult = {
    mode: string
    sub_mode: string
    items: Array<string>
    best: number
    score: number
    films: number
    actors: number
}

type GameInfo = {
    name: string
    img: string
}

type HistoricalData = {
    games: Array<GameResult>
    info: Dict<GameInfo>
}

const StatisticModal = () => {
    const data = readLocalStorage<HistoricalData>('historical_data', {info: {}, games: []});

    return (<>
        <div className="modal-title playfair">Past Games</div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            overflow: 'auto',
            flexBasis: '100%',
            flexShrink: 1,
            paddingRight: data.games.length >= 3 ? '25px' : '0'
        }} className="sleek-scroll">
            {
                data.games.length == 0 ? (
                    <>
                        <div style={{flexGrow: 1}}/>
                        <div className="modal-body akkurat" style={{justifySelf: 'center'}}>You have not played any games
                        </div>
                        <div style={{flexGrow: 1}}/>
                    </>
                ) : (
                    <>
                        {
                            data.games.map((game, ix) => (<>
                                <div className="modal-body akkurat" style={{textAlign: 'center'}}>{game.mode}</div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '25px',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: game.items.length <= 2 ? 'space-evenly' : 'flex-start',
                                        gap: '20px',
                                        overflowX: 'auto',
                                        maxWidth: '500px',
                                        flexGrow: 1
                                    }} className="sleek-scroll">
                                        {game.items.map(item_id => (<div
                                            key={item_id}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                            <div style={{
                                                height: '225px',
                                                width: '150px',
                                                backgroundImage: `url("${getProfileImage(data.info[item_id].img, 'sm')}")`,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <div style={{flexGrow: 1}}/>
                                                <div className="playfair actor-info" style={{flexGrow: 0, padding: '10px', fontSize: '1.2em'}}>{data.info[item_id].name}</div>
                                            </div>
                                        </div>))}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexShrink: 0
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            gap: '50px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start'
                                            }}>
                                                <h2>Best Path</h2>
                                                <h2>Best All Time Path</h2>
                                                <h2>Actors Found</h2>
                                                <h2>Films Found</h2>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end'
                                            }}>
                                                <h2>{game.score}</h2>
                                                <h2>{game.best}</h2>
                                                <h2>{game.actors}</h2>
                                                <h2>{game.films}</h2>
                                            </div>
                                        </div>
                                        <Button className="btn-solid akkurat" onClick={() => {}}>Replay</Button>
                                    </div>
                                </div>
                                {ix !== data.games.length - 1 ? (<div style={{
                                    border: 'solid 1px white',
                                    margin: '15px 0px'
                                }}/>) : null}
                            </>))
                        }
                    </>
                )
            }
        </div>
    </>)
        ;
}

export default StatisticModal;