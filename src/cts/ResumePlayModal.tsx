import React from "react";

import { getProfileImage } from "./api/tmdb";
import { GameData } from "./types";
import RightArrowButton from "../elements/RightArrowButton";

function getResumeModal(data: GameData, onSuccess: () => void) {
    const actorsFound: number = data.found.filter(c => c.startsWith('a')).length;
    const filmsFound: number = data.found.length - actorsFound;
    let bestPath: number = -1;
    if (data.bestPath)
        bestPath = data.bestPath;

    return (<div className="col" style={{margin: '0px 50px 25px 50px'}}>
        <div className="playfair modal-title">Found Game in Progress</div>
        <div className="akkurat modal-heading">- Mode -</div>
        <div className="akkurat modal-body">{data.mode}</div>
        <div className="akkurat modal-heading">- Actors -</div>
        <div className="row center" style={{gap: '20px', flexWrap: 'wrap'}}>
            {Object.entries(data.requires).map(([key, graphKey]) => {
                const a = data.pool[graphKey];
                return (<div key={key} style={{flex: '0 0 30%'}}>
                    <p className="modal-body akkurat">{key}</p>
                    <img
                        alt={a.name}
                        src={getProfileImage(a.image)}
                        className="modal-img"
                    />
                </div>);
            })}
        </div>
        <div className="akkurat modal-heading">- Stats -</div>
        <div className="col akkurat modal-body">
            <div>{`Actors Found: ${actorsFound}`}</div>
            <div>{`Films Found: ${filmsFound}`}</div>
            <div>{`Best Path: ${bestPath === -1 ? '???' : bestPath}`}</div>
        </div>
        <div className="row center" style={{marginTop: '15px'}}>
            <RightArrowButton label="Resume" visible={true} onClick={onSuccess}/>
        </div>
    </div>);
}

export default getResumeModal;
