import LParticles from "../elements/Particles";
import {find} from "../utils";
import React, {useEffect, useState} from "react";
import {PageContentProps} from "./Page";
import {GameData} from "../cts/types";
import getResumeModal from "../cts/modals/ResumePlayModal";
import Lobby from "../cts/Lobby";
import Cytoscape from "../cts/Cytoscape";
import useLocalStorage from "../cts/local_storage";
import { InfoCircleFilled } from "@ant-design/icons";
import CloseIcon from "../elements/CloseIcon";
import HowToPlayButton from "../elements/HowToPlayButton";
import { message } from "antd";

const ConnectTheStars = (props: Readonly<PageContentProps>) => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [mobileAlertDismissed, setMobileAlertDismissed] = useLocalStorage<boolean>('mobile', false);

    // TODO: Make a challenge menu
    // TODO: Make an alert handler

    function setGame(data: GameData | null) {
        setGameData(data);
        if (data)
            localStorage.setItem('game_data', JSON.stringify(data));
    }

    function returnToLobby() {
        setGameData(null);
    }

    return (<div className={`cts-background`}>
        <LParticles config={find('styles', 'connect-the-stars.json')}/>
        {/*<div style={{position: "fixed", left: 0, zIndex: 2, marginTop: 18, width: '100%', padding: '20px'}}>*/}
        {/*    {props.scale.startsWith('mobile') && (<div className="alert">*/}
        {/*        <InfoCircleFilled/>*/}
        {/*        <span className="txt-span">Connect the Stars is better on desktop browsers</span>*/}
        {/*        <button onClick={() => setMobileAlertDismissed(true)}><CloseIcon/></button>*/}
        {/*    </div>)}*/}
        {/*</div>*/}
        {!gameData ? React.createElement(Lobby, {
            ...props,
            setGameData: setGame,
        }) : React.createElement(Cytoscape, {
            ...props,
            returnToLobby: returnToLobby
        })}
    </div>);
}

export default ConnectTheStars;