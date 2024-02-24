import React from "react";
import { getProfileImage } from "../api/tmdb";
import { GameData } from "../types";
import { readLocalStorage } from "../local_storage";
import { toTitleCase } from "../utils";

const ResumeModal = () => {
    const data = readLocalStorage<GameData | null>('game_data', null);

    if (!data)
        return <></>;

    const actorsFound: number = data.found.filter(c => c.startsWith('a')).length;
    const filmsFound: number = data.found.length - actorsFound;
    let bestPath: number = -1;
    if (data.bestPath)
        bestPath = data.bestPath.distance;

    return (<>
        <div className="playfair modal-title">Found Game in Progress</div>
        <div className="akkurat modal-heading" style={{opacity: 1, marginBottom: '10px'}}>{data.mode}</div>
        <div className="row center sleek-scroll" style={{margin: '0 20px', gap: '20px', flexGrow: 1, overflowX: 'auto', justifyContent: 'safe center'}}>
            {Object.entries(data.requires).map(([key, graphKey]) => {
                // @ts-ignore
                const a = data.pool[graphKey];
                return (<div key={key} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundImage: `url("${getProfileImage(a.image, 'md')}")`,
                    backgroundSize: 'cover',
                    aspectRatio: '2 / 3',
                    flexGrow: 1,
                }}>
                    <div className="slot-name akkurat">{key}</div>
                    <div style={{flexGrow: 1}}/>
                    <div className="modal-body actor-info playfair" style={{padding: '20px', backdropFilter: 'blur(10px)'}}>{a.name}</div>
                </div>);
            })}
        </div>
        <div className="row" style={{margin: '25px', gap: '25px', justifyContent: 'center'}}>
            <div className="col akkurat modal-body" style={{justifyContent: 'flex-start', textAlign: 'left'}}>
                <div>Actors Found</div>
                <div>Films Found</div>
                <div>Best Path</div>
            </div>
            <div className="col akkurat modal-body" style={{justifyContent: 'flex-start'}}>
                <div>{actorsFound}</div>
                <div>{filmsFound}</div>
                <div>{bestPath === -1 ? '???' : bestPath}</div>
            </div>
        </div>
    </>);
}

export default ResumeModal;
