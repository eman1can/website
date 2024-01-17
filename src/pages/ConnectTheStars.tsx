import Navbar from "../elements/Navbar";
import LParticles from "../elements/Particles";
import { find } from "../utils";
import Home from "../cts/Home";
import React, {useEffect, useState} from "react";
import { PageContentProps } from "./Page";
import { GameData } from "../cts/types";
import getResumeModal from "../cts/ResumePlayModal";
import Modal from "../elements/Modal";
import Lobby from "../cts/Lobby";
import Cytoscape from "../cts/Cytoscape";

const ConnectTheStars = (props: Readonly<PageContentProps>) => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [resumeData, setResumeData] = useState<GameData | null>(null);

    const [modalContent, setModalContent] = useState<React.JSX.Element | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (!resumeData) {
            const data = localStorage.getItem('game_data');
            if (data) {
                setResumeData(JSON.parse(data));
                // setModalContent(getResumeModal(JSON.parse(data), () => {}));
            }
        }
    }, [resumeData]);

    const showHowToPlay = false;

    function setShowHowToPlay(newValue: boolean) {}
    function setShowResume(newValue: boolean) {}

    function setGame(data: GameData) {
        setGameData(data);
        localStorage.setItem('game_data', JSON.stringify(data));
    }

    function returnToLobby() {
        setGameData(null);
        setShowResume(false);
        const data = localStorage.getItem('game_data');
        if (data)
            setResumeData(JSON.parse(data));
    }

    return (<div className={`cts-background`}>
        <LParticles config={find('styles', 'connect-the-stars.json')}/>
        <Modal scale={props.scale} visible={modalVisible}>{modalContent}</Modal>
        {!gameData ? (<>
            <Lobby
                scale={props.scale}
                showHowToPlay={showHowToPlay}
                setShowHowToPlay={setShowHowToPlay}
                showResume={resumeData !== null}
                setShowResume={setShowResume}
                setGameData={setGame}
            />
            {/*{*/}
            {/*    resumeData ? (<ResumePlayModal*/}
            {/*        visible={showResume}*/}
            {/*        data={resumeData}*/}
            {/*        onCancel={() => {*/}
            {/*            setShowResume(false);*/}
            {/*        }}*/}
            {/*        onSuccess={() => {*/}
            {/*            setGameData(resumeData);*/}
            {/*        }}*/}
            {/*    />) : null*/}
            {/*}*/}
        </>) : (
            <Cytoscape
                scale={props.scale}
                showHowToPlay={showHowToPlay}
                setShowHowToPlay={setShowHowToPlay}
                returnToLobby={returnToLobby}
                data={gameData}
            />
        )}
    </div>);
}

export default ConnectTheStars;