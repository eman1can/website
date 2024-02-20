import Navbar from "../elements/Navbar";
import LParticles from "../elements/Particles";
import {find} from "../utils";
import Home from "../cts/Home";
import React, {useEffect, useState} from "react";
import {PageContentProps} from "./Page";
import {GameData} from "../cts/types";
import getResumeModal from "../cts/ResumePlayModal";
import Modal, {ModalProps} from "../elements/Modal";
import Lobby from "../cts/Lobby";
import Cytoscape from "../cts/Cytoscape";
import useLocalStorage from "../cts/local_storage";
import {InfoCircleFilled} from "@ant-design/icons";
import CloseIcon from "../elements/CloseIcon";

const ConnectTheStars = (props: Readonly<PageContentProps>) => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [resumeData, setResumeData] = useState<GameData | null>(null);

    const [mobileAlertDismissed, setMobileAlertDismissed] = useLocalStorage<boolean>('mobile', false);

    useEffect(() => {
        if (!resumeData) {
            const data = localStorage.getItem('game_data');
            if (data)
                setResumeData(JSON.parse(data));
        }
    }, [props, resumeData]);

    const resumeContent = resumeData ? {
        scale: '',
        children: getResumeModal(resumeData),
        onCancel: () => props.setModalContent(null),
        onSuccess: () => setGameData(resumeData),
        success: 'Resume',
        cancel: 'Discard',
        showClose: false
    } : null;


    function setGame(data: GameData) {
        setGameData(data);
        localStorage.setItem('game_data', JSON.stringify(data));
    }

    function returnToLobby() {
        setGameData(null);
        const data = localStorage.getItem('game_data');
        if (data)
            setResumeData(JSON.parse(data));
    }

    return (<div className={`cts-background`}>
        <LParticles config={find('styles', 'connect-the-stars.json')}/>
        {/*{props.scale.startsWith('mobile') && (<div className="alert">*/}
        {/*    <InfoCircleFilled/>*/}
        {/*    <span className="txt-span">Connect the Stars is better on desktop browsers</span>*/}
        {/*    <button onClick={() => setMobileAlertDismissed(true)}><CloseIcon/></button>*/}
        {/*</div>)}*/}
        <>
            {!gameData ? React.createElement(Lobby, {
                ...props,
                setGameData: setGame,
                resumeContent: resumeContent
            }) : React.createElement(Cytoscape, {
                ...props,
                returnToLobby: returnToLobby,
                data: gameData
            })}
        </>
    </div>);
}

export default ConnectTheStars;