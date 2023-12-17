import {Alert, Popover} from "antd";
import {InfoCircleFilled, SettingFilled, ArrowDownOutlined} from "@ant-design/icons";
import find from "../utils";
import HowToPlayModal from "./HowToPlayModal";
import OptionsModal from "./OptionsModal";
import React, {useEffect, useRef, useState} from "react";
import DynamicButton from "../elements/DynamicButton";
import useLocalStorage from "./local_storage";
import Unselectable from '../elements/Unselectable';
import Button from "../elements/Button";
import ButtonGroup from "antd/es/button/button-group";
import {GameNames, GameTypes} from "./games";
import ActorContainer from "./ActorContainer";

type HowToPlayButtonProps = {
    mobile: boolean,
    showIcon?: boolean
}

type LobbyProps = {
    mobile: boolean,
    showHowToPlay: boolean,
    setShowHowToPlay: ((newValue: boolean) => void),
    HowToPlayButton: ((props: HowToPlayButtonProps) => React.JSX.Element)
}


const Lobby = (props: LobbyProps) => {
    const [mobileClosed, setMobileClosed] = useLocalStorage('mobile', false);

    const [showOptions, setShowOptions] = useState(false);
    const OptionsButton = (props: {
        mobile: boolean,
        showIcon?: boolean
    }) => {
        return <DynamicButton
            mobile={props.mobile}
            showIcon={props.showIcon}
            icon={<SettingFilled/>}
            label="Options"
            onClick={() => setShowOptions(true)}
        />;
    }

    const [selectGameMode, setSelectGameMode] = useState(false);

    const [useStandard, setUseStandard] = useLocalStorage('use_default', true);
    const [useExpanded, setUseExpanded] = useLocalStorage('use_expanded', false);
    const [useBollywood, setUseBollywood] = useLocalStorage('use_bollywood', false);
    const [useBlockbuster, setUseBlockbuster] = useLocalStorage('use_blockbuster', false);
    const [blockMovieSeries, setBlockMovieSeries] = useLocalStorage('block_movie_series', false);
    const [gameMode, setGameMode] = useLocalStorage('game_mode', 'classic');

    return (<>
        {props.mobile && !mobileClosed && (<div className="alert">
            <InfoCircleFilled/>
            <span className="txt-span">Connect the Stars is better on desktop browsers</span>
            <button onClick={() => setMobileClosed(true)}><img alt="Close" src={find('assets/cts', 'close.svg')}/>
            </button>
        </div>)}
        <OptionsModal
            visible={showOptions}
            onCancel={() => setShowOptions(false)}
            options={{
                useStandard,
                setUseStandard,
                useExpanded,
                setUseExpanded,
                useBollywood,
                setUseBollywood,
                useBlockbuster,
                setUseBlockbuster,
                blockMovieSeries,
                setBlockMovieSeries
            }}
        />
        <div style={{position: "absolute", top: 68, left: 18, zIndex: 2}}>
            {props.mobile ? null : <props.HowToPlayButton mobile={false}/>}
        </div>
        <div style={{position: "absolute", top: 68, right: 18, zIndex: 2}}>
            {props.mobile ? null : <OptionsButton mobile={false}/>}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center'}}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyItems: 'center',
                marginTop: '15px',

            }}>
                <Unselectable style={{padding: 0}}>
                    <img
                        className="unselectable"
                        src={find('assets/cts', 'logo.png')}
                        alt="Logo"
                        style={{width: 56}}
                    />
                </Unselectable>
                <Unselectable style={{padding: 0}}>
                    <h1
                        className="unselectable"
                        style={{
                            color: "#fff",
                            marginBottom: 0,
                            marginLeft: '12px'
                        }}
                    >
                        Connect the Stars
                    </h1>
                </Unselectable>
            </div>
            <div style={{marginBottom: '20px'}}>
                <div>- A Movie Trivia Game -</div>
            </div>
            {props.mobile ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyItems: 'space-between',
                    margin: '0 25px'
                }}>
                    <props.HowToPlayButton mobile={true}/>
                    <div style={{marginLeft: '16px'}}>
                        <OptionsButton mobile={true}/>
                    </div>
                </div>
            ) : null}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyItems: 'center',
                marginTop: '15px',
                width: '306px'
            }}>
                <Button
                    className="btn-on-stars"
                    style={{flexGrow: 1}}
                    onClick={() => props.setShowHowToPlay(true)}
                >
                    {GameNames[gameMode]}
                </Button>
                <Button
                    className="icon-btn btn-on-stars"
                    icon={<ArrowDownOutlined style={{padding: '0 0 0 6px'}}/>}
                    onClick={() => setSelectGameMode(!selectGameMode)}
                />
            </div>
            <div className={`popper ${selectGameMode && 'visible'}`}>
                {Object.keys(GameNames).map(key => {
                    return (
                        <button
                            onClick={() => {
                                setSelectGameMode(false);
                                setGameMode(key);
                            }}
                        >{GameNames[key]}</button>
                    );
                })}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyItems: 'center',
            }}>
                <ActorContainer title={'A'}/>
                <ActorContainer title={'B'}/>
            </div>
        </div>
    </>);
    // TODO: Start Button
    // TODO: Credits Section
    // TODO: Update Containers on Game Mode
    // TODO: Crate HELP Sections for each game
    // TODO: URL Parameters
    // TODO: Extract URL chaining in Actor params out
}

export default Lobby;