import React, { useEffect, useState } from "react";

import {
    InfoCircleFilled,
} from "@ant-design/icons";

import { useMobile } from "../mobile";
import DynamicButton from "../elements/DynamicButton";
import Lobby from "./Lobby";
import HowToPlayModal from "./HowToPlayModal";
import { GameData } from "./types";
import ResumePlayModal from "./ResumePlayModal";
import Cytoscape from "../cts/Cytoscape";

type HowToPlayButtonProps = {
    mobile: boolean,
    showIcon?: boolean
}

const Home = () => {
    const mobile = useMobile();

    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const HowToPlayButton = (props: HowToPlayButtonProps): React.JSX.Element => {
        return <DynamicButton
            mobile={props.mobile}
            showIcon={props.showIcon}
            icon={<InfoCircleFilled/>}
            label="How To Play"
            onClick={() => setShowHowToPlay(true)}
        />;
    }

    const [gameData, setGameData] = useState<GameData | null>(null);
    const [resumeData, setResumeData] = useState<GameData | null>(null);
    const [showResume, setShowResume] = useState<boolean>(false);

    // TODO: Read Game Data from Local Storage /
    // And ask to resume game
    useEffect(() => {
        if (!resumeData) {
            const data = localStorage.getItem('game_data');
            if (data) {
                setResumeData(JSON.parse(data));
                setGameData(JSON.parse(data));
            }
        }
    }, [resumeData]);

    function setGame(data: GameData) {
        setGameData(data);
        localStorage.setItem('game_data', JSON.stringify(data));
    }

    return (<>
        <HowToPlayModal
            visible={showHowToPlay}
            onCancel={() => setShowHowToPlay(false)}
        />
        {!gameData ? (<>
            <Lobby
                mobile={mobile}
                showHowToPlay={showHowToPlay}
                setShowHowToPlay={setShowHowToPlay}
                HowToPlayButton={HowToPlayButton}
                showResume={resumeData !== null}
                setShowResume={setShowResume}
                setGameData={setGame}
            />
            {
                resumeData ? (<ResumePlayModal
                    visible={showResume}
                    data={resumeData}
                    onCancel={() => {
                        setShowResume(false);
                    }}
                    onSuccess={() => {
                        localStorage.removeItem('game_data');
                        setGameData(resumeData);
                        setResumeData(null);
                    }}
                />) : null
            }
        </>) : (
            <Cytoscape
                mobile={mobile}
                showHowToPlay={showHowToPlay}
                setShowHowToPlay={setShowHowToPlay}
                HowToPlayButton={HowToPlayButton}
                data={gameData}
            />
        )}
    </>);
}

export default Home;