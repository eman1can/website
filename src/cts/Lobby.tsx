import {InfoCircleFilled, SettingFilled, ArrowDownOutlined, ArrowRightOutlined} from "@ant-design/icons";
import find, { shouldFilterFilm, compileAlternateTitles } from "../utils";
import OptionsModal from "./OptionsModal";
import React, {useEffect, useRef, useState} from "react";
import DynamicButton from "../elements/DynamicButton";
import useLocalStorage from "./local_storage";
import Unselectable from '../elements/Unselectable';
import Button from "../elements/Button";
import { GameNames, GameTypes, SubTitles } from "./games";
import ActorContainer from "./ActorContainer";
import { LobbyProps, HowToPlayButtonProps, Actor } from "./types";
import CreditsSection from "./CreditsSection";
import CloseIcon from "../elements/CloseIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiActor, ApiSearchActor, FilmCast } from "./api/api_types";
import { getActor as apiGetActor } from "./api/tmdb";
import { Dict, Map } from './types';
import { filterActors } from "./api/utils";


const Lobby = (props: LobbyProps) => {
    const [mobileClosed, setMobileClosed] = useLocalStorage<boolean>('mobile', false);

    const [showOptions, setShowOptions] = useState<boolean>(false);
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

    const { pathname, search } = useLocation();
    const navigate = useNavigate();

    const [selectGameMode, setSelectGameMode] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('classic');
    const [subMode, setSubMode] = useState<string>('');

    const [params, setParams] = useState(new URLSearchParams(search));

    const [subtitle, setSubtitle] = useState<string>(SubTitles[Math.floor(Math.random() * SubTitles.length)]);
    const [startVisible, setStartVisible] = useState<boolean>(false);

    const [useStandard, setUseStandard] = useLocalStorage<boolean>('use_default', true);
    const [useExpanded, setUseExpanded] = useLocalStorage<boolean>('use_expanded', false);
    const [useBollywood, setUseBollywood] = useLocalStorage<boolean>('use_bollywood', false);
    const [useBlockbuster, setUseBlockbuster] = useLocalStorage<boolean>('use_blockbuster', false);
    const [allowMovieSeries, setAllowMovieSeries] = useLocalStorage<boolean>('allow_movie_series', true);
    const [allowTVSeries, setAllowTVSeries] = useLocalStorage<boolean>('allow_tv_series', false);
    const [allowHints, setAllowHints] = useLocalStorage<boolean>('use_hints', false);
    const [disableProfile, setDisableProfile] = useLocalStorage<boolean>('disable_profile', false);

    const [actors, setActors] = useState<Dict<Actor | null>>({});

    function isValid(): boolean {
        if (mode in GameTypes && subMode in GameTypes[mode].containers) {
            let valid = true;
            for (const key of GameTypes[mode].containers[subMode])
                valid &&= actors[key] !== null;
            return valid;
        }
        return false;
    }

    // Read the starting url params
    useEffect(() => {
        const params = new URLSearchParams(search);
        params.forEach((value, key) => {
            if (key === 'mode') {
                if (value !== mode)
                    setMode(value);
            } else if (key === 'sub-mode') {
                if (value !== subMode)
                setSubMode(value);
            } else {
                if (!actors[key] || actors[key]?.id.toString() !== value) {
                    apiGetActor({id: value}).then(actor => {
                        setActor(key, actor);
                    });
                }
            }
        });

        setStartVisible(isValid());
    }, [search, mode, subMode, actors, isValid, setActor]);

    function setGameMode(newMode: string) {
        const params = new URLSearchParams(search);
        const a = actors;

        for (const key of Object.keys(actors)) {
            params.delete(key);
            a[key] = null;
        }

        setActors(a);

        setMode(newMode);
        params.set('mode', newMode);

        const newSubMode = GameTypes[newMode].default;
        setSubMode(subMode);
        if (newSubMode !== '')
            params.set('sub-mode', newSubMode);

        navigate(`${pathname}?${params.toString()}`, {replace: true});

        setStartVisible(false);
    }

    function setActor(key: string, actor: Actor | null) {
        const params = new URLSearchParams(search);
        const a = actors;

        a[key] = actor;

        if (actor) {
            params.set(key, actor.id.toString());
        } else {
            params.delete(key);
        }

        setActors(a);
        navigate(`${pathname}?${params.toString()}`, {replace: true});

        setStartVisible(isValid());
    }

    function cycleSubMode() {
        const modes = GameTypes[mode].modes
        if (modes) {
            const ix = (modes.indexOf(subMode) + 1) % modes.length
            setSubMode(modes[ix]);

            const params = new URLSearchParams(search);
            params.set('sub-mode', subMode);
            navigate(`${pathname}?${params.toString()}`, {replace: true});
        }

        setStartVisible(isValid());
    }

    function cycleSubtitle() {
        const ix = (SubTitles.indexOf(subtitle) + 1) % SubTitles.length;
        setSubtitle(SubTitles[ix]);
    }

    function initGameData() {
        const nodes: Promise<ApiActor>[] = [];
        const params = new URLSearchParams(search);
        params.forEach((value, key) => {
            if (key !== 'mode' && key !== 'sub-mode') {
                const actor = actors[key];
                if (actor) {
                    nodes.push(apiGetActor(actor, true));
                }
            }
        });

        Promise.all(nodes).then(responses => {
            const actorDict: Dict<Actor> = {};
            const filmDict: Dict<FilmCast> = {};

            responses.forEach(actor => {
                actorDict[actor.name] = actor;
                actor.credits?.cast.filter(shouldFilterFilm).forEach((f: FilmCast) => {
                    filmDict[f.title] = f;
                });
            });

            compileAlternateTitles(filmDict).then(map => {
                props.setGameData({
                    mode: mode,
                    subMode: subMode,
                    filmMap: map,
                    found: {actors: actorDict, films: {}},
                    answers: {actors: {}, films: filmDict},
                    requires: responses
                });
            });
        });
    }

    function filterSearchActors(r: ApiSearchActor, s: string) {
        return filterActors(r, s, Object.values(actors).map(a => a?.id));
    }

    function getOptions(): Dict<boolean> {
        return {
            default: useStandard,
            expanded: useExpanded,
            bollywood: useBollywood,
            blockbuster: useBlockbuster
        }
    }

    const numSelected = [useStandard, useExpanded, useBollywood, useBlockbuster].filter(v => v).length;

    return (<>
        {props.mobile && !mobileClosed && (<div className="alert">
            <InfoCircleFilled/>
            <span className="txt-span">Connect the Stars is better on desktop browsers</span>
            <button onClick={() => setMobileClosed(true)}><CloseIcon/></button>
        </div>)}
        <OptionsModal
            visible={showOptions}
            onCancel={() => setShowOptions(false)}
            options={[
                {loc: 'Gameplay', title: 'Allow In-Game Hints', state: allowHints, toggle: setAllowHints},
                {loc: 'Gameplay', title: 'Allow Movie in a Series', state: allowMovieSeries, toggle: setAllowMovieSeries},
                {loc: 'Gameplay', title: 'Allow TV Shows', state: allowTVSeries, toggle: setAllowTVSeries},
                {loc: 'Gameplay', title: 'Disable Profile Pictures', state: disableProfile, toggle: setDisableProfile},
                {loc: 'Choose For Me', title: 'Use default actors', state: useStandard, toggle: setUseStandard, disabled: useStandard && numSelected === 1},
                {loc: 'Choose For Me', title: 'Use expanded actors', state: useExpanded, toggle: setUseExpanded, disabled: useExpanded && numSelected === 1},
                {loc: 'Choose For Me', title: 'Use Bollywood actors', state: useBollywood, toggle: setUseBollywood, disabled: useBollywood && numSelected === 1},
                {loc: 'Choose For Me', title: 'Use pre-blockbuster actors', state: useBlockbuster, toggle: setUseBlockbuster, disabled: useBlockbuster && numSelected === 1}
            ]}
        />
        <div style={{position: "absolute", top: 18, left: 18, zIndex: 2}}>
            {props.mobile ? null : <props.HowToPlayButton mobile={false}/>}
        </div>
        <div style={{position: "absolute", top: 18, right: 18, zIndex: 2}}>
            {props.mobile ? null : <OptionsButton mobile={false}/>}
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent  : 'flex-start'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '15px'
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
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
            }}>
                <Button onClick={(() => cycleSubtitle())} style={{
                    border: '0px solid white',
                    fontVariant: 'small-caps',
                    textTransform: 'capitalize',
                    fontSize: '20px'
                }}>— {subtitle} —</Button>
            </div>
            {props.mobile ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
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
            <div id='mode-row' style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Button
                    className="btn-solid"
                    style={{width: '300px'}}
                    onClick={() => props.setShowHowToPlay(true)}
                >
                    {GameNames[mode]}
                </Button>
                <Button
                    className="icon-btn btn-solid"
                    style={{width: '80px'}}
                    icon={<ArrowDownOutlined style={{padding: '0 0 0 6px'}}/>}
                    onClick={() => setSelectGameMode(!selectGameMode)}
                />
            </div>
            <div className={`popper ${selectGameMode && 'visible'}`} style={{
                left: '50%',
                marginLeft: '-190px',
                width: '380px',
                top: document.getElementById('mode-row')?.getBoundingClientRect().bottom,
                backdropFilter: 'blur(50px)'
            }}>
                {Object.keys(GameNames).map(key => {
                    return (
                        <button
                            key={key}
                            onClick={() => {
                                setGameMode(key);
                                setSelectGameMode(false);
                            }}
                        >{GameNames[key]}</button>
                    );
                })}
            </div>
            {GameTypes[mode].modes ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '15px',
                    width: '306px'
                }}>
                    <Button
                        className="btn-solid"
                        onClick={() => cycleSubMode()}
                        style={{flexGrow: 1}}
                    >
                        {GameNames[`${mode}_${subMode}`]}
                    </Button>
                </div>
            ) : null}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {mode in GameTypes && subMode in GameTypes[mode].containers && GameTypes[mode].containers[subMode].map(key => {
                    return <ActorContainer
                        key={key}
                        title={key}
                        actor={actors[key]}
                        setActor={setActor}
                        showProfile={!disableProfile}
                        filter={filterSearchActors}
                        getOptions={getOptions}
                    />;
                })}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '25px'
            }}>
                {props.showResume ? (
                    <Button
                        className="btn-solid"
                        style={{
                            opacity: props.showResume ? 1 : 0,
                            pointerEvents: props.showResume ? 'auto' : 'none',
                            width: '175px',
                            marginRight: '20px'
                        }}
                        onClick={() => props.setShowResume(true)}
                    >
                        Resume Game
                    </Button>
                ) : null}
                <Button
                    className="btn-solid"
                    style={{
                        opacity: startVisible ? 1 : 0,
                        pointerEvents: startVisible ? 'auto' : 'none',
                        width: '175px'
                }}
                    onClick={() => initGameData()}
                    iconRight={<ArrowRightOutlined/>}
                >
                    Start Game
                </Button>
            </div>
            <CreditsSection/>
        </div>
    </>);
    // TODO: Credits Section - Finish SVGs and styles
    // TODO: Fix container sizing and scrolling on differing screen sizes
    // TODO: Crate HELP Sections for each game
    // TODO: Add ripple effect to buttons
}

export default Lobby;