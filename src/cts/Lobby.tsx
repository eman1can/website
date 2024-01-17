import {InfoCircleFilled, ArrowDownOutlined} from "@ant-design/icons";
import { find } from "../utils";
import OptionsModal from "./OptionsModal";
import React, {useEffect, useState} from "react";
import useLocalStorage from "./local_storage";
import Unselectable from '../elements/Unselectable';
import Button from "../elements/Button";
import { GameNames, GameTypes, SubTitles } from "./games";
import Container from "./Container";
import { GameData, Dict, GameType } from "./types";
import { Actor, AlternativeTitles, Film } from "./api/types";
import CreditsSection from "./CreditsSection";
import CloseIcon from "../elements/CloseIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { getData as apiGetData, getAlternateTitles as apiGetAlternativeTitles } from "./api/tmdb";
import { filterActors } from "./api/utils";
import HowToPlayButton from "../elements/HowToPlayButton";
import OptionsButton from "../elements/OptionsButton";
import RightArrowButton from "../elements/RightArrowButton";
import ResumeButton from "../elements/ResumeButton";


export type LobbyProps = {
    scale: string
    showHowToPlay: boolean
    setShowHowToPlay: ((newValue: boolean) => void)
    showResume: boolean
    setShowResume: ((newValue: boolean) => void)
    setGameData: ((newData: GameData) => void)
}

const Lobby = (props: Readonly<LobbyProps>) => {
    const mobile = props.scale.startsWith('mobile');

    const [mobileClosed, setMobileClosed] = useLocalStorage<boolean>('mobile', false);

    const [showOptions, setShowOptions] = useState<boolean>(false);

    const { pathname, search } = useLocation();
    const navigate = useNavigate();

    const [selectGameMode, setSelectGameMode] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('classic');
    const [subMode, setSubMode] = useState<string>('');

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

    const [items, setItems] = useState<Dict<GameType | null>>({});

    function isValid(): boolean {
        if (mode in GameTypes && subMode in GameTypes[mode].containers) {
            let valid = true;
            for (const key of GameTypes[mode].containers[subMode])
                valid &&= items[key] !== null;
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
            } else if (!items[key] || items[key]?.id !== value) {
                apiGetData({id: value}).then(item => setItem(key, item));
            }
        });

        setStartVisible(isValid());
    }, [search, mode, subMode, items, isValid, setItem]);

    function setGameMode(newMode: string) {
        const params = new URLSearchParams(search);
        const current = items;

        for (const key of Object.keys(current)) {
            params.delete(key);
            current[key] = null;
        }

        setItems(current);

        setMode(newMode);
        params.set('mode', newMode);

        const newSubMode = GameTypes[newMode].default;
        setSubMode(newSubMode);
        if (newSubMode !== '')
            params.set('sub-mode', newSubMode);

        navigate(`${pathname}?${params.toString()}`, {replace: true});

        setStartVisible(false);
    }

    function setItem(key: string, item: Actor | Film | null) {
        const params = new URLSearchParams(search);
        const current = items;

        current[key] = item;

        if (item) {
            params.set(key, item.id);
        } else {
            params.delete(key);
        }

        setItems(current);

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
        const params = new URLSearchParams(search);

        const requires: Dict<string> = {};
        const nodes: Array<Promise<GameType>> = [];
        params.forEach((value, key) => {
            if (key !== 'mode' && key !== 'sub-mode') {
                const item = items[key];
                if (item) {
                    nodes.push(apiGetData(item, true));
                    requires[key] = item.id;
                }
            }
        });

        Promise.all(Object.values(nodes)).then((responses: Array<GameType>) => {
            const found: Array<string> = [];
            const pool: Dict<GameType> = {};

            const altPromises: Array<Promise<AlternativeTitles>> = [];
            responses.forEach(item => {
                pool[item.id] = item;
                found.push(item.id);
                item.credits?.forEach((f: GameType) => {
                    pool[f.id] = f;
                    if (f.id.startsWith('f'))
                        altPromises.push(apiGetAlternativeTitles(f));
                });
            });

            Promise.all(altPromises).then((responses: Array<AlternativeTitles>) => {
                const alt: Dict<Array<string>> = {};
                responses.forEach(item => {
                    alt[item.id] = item.titles;
                });

                props.setGameData({
                    mode: mode,
                    subMode: subMode,
                    altTitles: alt,
                    found: found,
                    pool: pool,
                    requires: requires
                });
            });
        });
    }

    function filterSearch(r: Array<GameType>, s: string): Array<GameType> {
        return filterActors(r, s, Object.values(items).flatMap(c => c ? [c.id] : []));
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
        {mobile && !mobileClosed && (<div className="alert">
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
            {mobile ? null : <HowToPlayButton mobile={false} onClick={() => props.setShowHowToPlay(true)}/>}
        </div>
        <div style={{position: "absolute", top: 18, right: 18, zIndex: 2}}>
            {mobile ? null : <OptionsButton mobile={false} onClick={() => setShowOptions(true)}/>}
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
            {mobile ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyItems: 'space-between',
                    margin: '0 25px'
                }}>
                    <HowToPlayButton mobile={true} onClick={() => props.setShowHowToPlay(true)}/>
                    <div style={{marginLeft: '16px'}}>
                        <OptionsButton mobile={true} onClick={() => setShowOptions(true)}/>
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
                    return <Container
                        key={key}
                        title={key}
                        item={items[key]}
                        setItem={setItem}
                        showProfile={!disableProfile}
                        filter={filterSearch}
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
                <ResumeButton visible={props.showResume} onClick={() => props.setShowResume(true)}/>
                <RightArrowButton label="Start Game" visible={startVisible} onClick={() => initGameData()}/>
            </div>
            <CreditsSection/>
        </div>
    </>);

    // TODO: ADD RIPPLE
    // TODO: Credits Section - Finish SVGs and styles
    // TODO: Fix container sizing and scrolling on differing screen sizes
    // TODO: Crate HELP Sections for each game
}

export default Lobby;