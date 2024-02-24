import { ArrowDownOutlined, ArrowRightOutlined, InfoCircleFilled, UploadOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import useLocalStorage, { readLocalStorage } from "./local_storage";
import Button from "../elements/Button";
import Container from "./Container";
import { GameData, Dict, GameType } from "./types";
import { Actor, AlternativeTitles, Film } from "./api/types";
import CreditsSection from "./CreditsSection";
import { useLocation, useNavigate } from "react-router-dom";
import { getData as apiGetData, getAlternateTitles as apiGetAlternativeTitles } from "./api/tmdb";
import { filterActors } from "./api/utils";
import HowToPlayButton from "../elements/HowToPlayButton";
import OptionsButton from "../elements/OptionsButton";
import { ModalProps } from "../elements/Modal";
import StatsButton from "../elements/StatsButton";
import LogoHeader from "../elements/LogoHeader";
import { LANGUAGE_NAMES, SUBTITLE_COUNT, useLanguage } from "../lang";
import Upload from "../elements/Upload";
import { showAlert } from "./utils";
import LanguageButton from "../elements/LanguageButton";
import Popper from "../elements/Popper";

const GameTypes: { [key: string]: { default: string, modes?: string[], containers: { [key: string]: string[] } } } = {
    // Connect two actors together
    classic: {default: '', containers: {'': ['one', 'two']}},
    // Connect two actors through a third actor
    detour: {default: '', containers: {'': ['one', 'detour', 'two']}},
    // Connect two actors, with a popularity below a threshold or a person
    rising: {
        default: 'Value',
        modes: ['Value', 'Person'],
        containers: {Value: ['one', 'two'], Person: ['one', 'two', 'max']}
    },
    // Connect up to six stars together
    web: {default: '', containers: {'': ['one', 'two', 'three', 'four', 'five', 'six']}}
}

export type LobbyProps = {
    scale: string
    setModalContent: (newContent: ModalProps | null) => void
    setGameData: (newData: GameData | null) => void
}

// TODO: Only accept url params for the correct game mode

const Lobby = (props: Readonly<LobbyProps>) => {
    const mobile = props.scale.startsWith('mobile');

    const {pathname, search} = useLocation();
    const navigate = useNavigate();

    const [currentLanguage, setLanguage, getString] = useLanguage();
    const [selectLanguage, setSelectLanguage] = useState<boolean>(false);

    const [resumeData, setResumeData] = useLocalStorage<GameData | null>('game_data', null);

    const [selectGameMode, setSelectGameMode] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('classic');
    const [subMode, setSubMode] = useState<string>('');



    const [subtitle, setSubtitle] = useState<number>(Math.floor(Math.random() * SUBTITLE_COUNT));
    const [startVisible, setStartVisible] = useState<boolean>(false);

    const [items, setItems] = useState<Dict<GameType | null>>({});

    const isValid = useCallback<() => boolean>(() => {
        if (mode in GameTypes && subMode in GameTypes[mode].containers) {
            let valid = true;
            for (const key of GameTypes[mode].containers[subMode]) {
                valid &&= items[key] !== null && items[key] !== undefined;
            }
            return valid;
        }
        return false;
    }, [items, mode, subMode]);

    const setItem = useCallback<(key: string, item: Actor | Film | null) => void>((key: string, item: Actor | Film | null) => {
        const params = new URLSearchParams(search);
        const current = items;

        current[key] = item;
        setItems(current);

        if (item && params.get(key) !== item.id) {
            params.set(key, item.id);
            navigate(`${pathname}?${params.toString()}`, {replace: true});
        } else if (!item && params.has(key)) {
            params.delete(key);
            navigate(`${pathname}?${params.toString()}`, {replace: true});
        }

        setStartVisible(isValid());
    }, [isValid, items, navigate, pathname, search]);

    // Read the starting url params
    useEffect(() => {
        const params = new URLSearchParams(search);

        const paramMode = params.get('mode');
        if (paramMode && paramMode !== mode)
            setMode(paramMode);

        const paramSubMode = params.get('sub-mode');
        if (paramSubMode && paramSubMode !== subMode && paramSubMode in GameTypes[mode].containers)
            setSubMode(paramSubMode);

        params.forEach((value, key) => {
            if (key !== 'mode' && key !== 'sub-mode') {
                if (GameTypes[mode].containers[subMode].includes(key)) {
                    if (!items[key] || items[key]?.id !== value) {
                        apiGetData({id: value}).then(item => setItem(key, item));
                    }
                } else {
                    params.delete(key);
                }
            }
        });

        navigate(`${pathname}?${params.toString()}`, {replace: true});

        setStartVisible(isValid());
    }, [search, mode, subMode, items, isValid, setItem]);

    function getResumeContent(data: GameData) {
        return {
            scale: '',
            modalName: 'cts_Resume',
            getString: getString,
            onCancel: () => {
                props.setGameData(null);
                setResumeData(null);
                props.setModalContent(null);
            },
            onSuccess: () => {
                props.setGameData(data);
                props.setModalContent(null);
            },
            onClose: () => {
                props.setModalContent(null);
            },
            success: 'Resume',
            cancel: 'Discard',
            showClose: true
        };
    }

    function setGameMode(newMode: string) {
        const params = new URLSearchParams(search);
        const current = items;
        const newSubMode = GameTypes[newMode].default;

        const newKeys = GameTypes[newMode].containers[newSubMode];
        for (const key of Object.keys(current)) {
            if (!newKeys.includes(key)) {
                params.delete(key);
                current[key] = null;
            }
        }

        setItems(current);
        setMode(newMode);
        params.set('mode', newMode);

        setSubMode(newSubMode);
        if (newSubMode !== '')
            params.set('sub-mode', newSubMode);
        else
            params.delete('sub-mode');

        navigate(`${pathname}?${params.toString()}`, {replace: true});

        setStartVisible(false);
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
        const ix = (subtitle + 1) % SUBTITLE_COUNT;
        setSubtitle(ix);
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

    const howToPlayContent = {
        scale: '',
        modalName: 'cts_HowToPlay',
        getString: (s: string) => s,
        onCancel: () => props.setModalContent(null),
        onSuccess: () => {
        },
        showClose: true
    };

    const optionsContent = {
        scale: '',
        modalName: 'cts_Options',
        getString: getString,
        onCancel: () => props.setModalContent(null),
        onSuccess: () => {
        },
        showClose: true
    }

    const hasStatistics = readLocalStorage('historical_data', null) !== null;
    const statisticContent = {
        scale: '',
        modalName: 'cts_Statistic',
        getString: getString,
        onCancel: () => props.setModalContent(null),
        onSuccess: () => {
        },
        showClose: true
    }

    console.log(currentLanguage, LANGUAGE_NAMES)
    // TODO: Add Language dropdown
    // TODO: Fix Sub Mode Selection & Add threshold selection
    // TODO: Add challenge menu
    return (<>
        {/*<div style={{position: "fixed", left: 18, zIndex: 2, marginTop: 18}}>*/}
        {/*    {mobile ? null : <HowToPlayButton mobile={false} onClick={() => props.setModalContent(howToPlayContent)}/>}*/}
        {/*</div>*/}
        <div style={{position: "fixed", right: 18, zIndex: 2, marginTop: 18}}>
            {mobile ? null : <OptionsButton mobile={false} onClick={() => props.setModalContent(optionsContent)}/>}
        </div>
        {/*{hasStatistics ? (<div style={{position: "fixed", left: 18, zIndex: 2, marginTop: 76}}>*/}
        {/*    {mobile ? null : <StatsButton mobile={false} onClick={() => props.setModalContent(statisticContent)}/>}*/}
        {/*</div>) : null}*/}
        <div style={{position: "fixed", left: 18, zIndex: 2, marginTop: 18}}>
            {mobile ? null : <LanguageButton mobile={false} current={LANGUAGE_NAMES[currentLanguage]} onClick={() => setSelectLanguage(!selectLanguage)}/>}
            <Popper anchor="language-button" visible={selectLanguage} content={(<>
                {Object.entries(LANGUAGE_NAMES).map(([key, value]) => {
                    return (
                        <button
                            key={key}
                            onClick={() => {
                                setLanguage(key);
                                setSelectLanguage(false);
                            }}
                            disabled={currentLanguage === key}
                        >{value}</button>
                    );
                })}
            </>)}/>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'center',
            flexGrow: 1,
        }}>
            <LogoHeader title={getString('lobby.title')}/>
            {!mobile ? (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // marginBottom: '20px'
                }}>
                    <Button onClick={(() => cycleSubtitle())} style={{
                        border: '0px solid white',
                        fontVariant: 'small-caps',
                        textTransform: 'capitalize',
                        fontSize: '20px'
                    }}>— {getString(`lobby.subtitle${subtitle}`)} —</Button>
                </div>
            ) : null}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin: '25px',
                    gap: '16px',
                    maxWidth: '500px',
                    minWidth: props.scale.includes('sm') ? '175px' : '250px'
                }}>
                    {mobile ? (<div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '16px'
                    }}>
                        {/*<HowToPlayButton mobile={true} onClick={() => props.setModalContent(howToPlayContent)}/>*/}
                        {/*<LanguageButton mobile={true} current={currentLanguage} onClick={() => props.setModalContent(statisticContent)}/>*/}
                        <OptionsButton mobile={true} onClick={() => props.setModalContent(optionsContent)}/>
                    </div>) : null}
                    {hasStatistics ? (<div style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <StatsButton mobile={true} onClick={() => props.setModalContent(statisticContent)}/>
                    </div>) : null}
                    <div id='mode-row' style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <Button
                            className={`btn-solid ${props.scale}`}
                            style={{flexBasis: '80%', minWidth: '300px'}}
                            icon={<InfoCircleFilled/>}
                            onClick={() => props.setModalContent(howToPlayContent)}
                        >
                            {getString(`mode.${mode}`)}
                        </Button>
                        <Button
                            className={`icon-btn btn-solid ${props.scale}`}
                            style={{flexBasis: '20%'}}
                            icon={<ArrowDownOutlined/>}
                            onClick={() => setSelectGameMode(!selectGameMode)}
                        />
                    </div>
                    <Popper anchor="mode-row" visible={selectGameMode} content={(<>
                        {Object.keys(GameTypes).map(key => {
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setGameMode(key);
                                        setSelectGameMode(false);
                                    }}
                                >{getString(`mode.${key}`)}</button>
                            );
                        })}
                    </>)}/>
                </div>
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
                        {getString(`mode.${subMode}`)}
                    </Button>
                </div>
            ) : null}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                alignItems: 'stretch',
                justifyContent: 'safe center',
                maxHeight: '600px',
                maxWidth: '100%',
                overflowX: 'auto',
                margin: '0 25px',
                gap: '25px'
            }} className="sleek-scroll">
                {mode in GameTypes && subMode in GameTypes[mode].containers && GameTypes[mode].containers[subMode].map((key, ix) => {
                    const keys = GameTypes[mode].containers[subMode];
                    if (mode === 'web' && ix > 1 && keys.slice(ix - 1).map(k => items[k]).filter(o => o).length == 0)
                        return null;
                    return <Container
                        key={key}
                        getString={getString}
                        scale={props.scale}
                        title={getString(`container.${key}`)}
                        item={items[key]}
                        setItem={setItem}
                        filter={filterSearch}
                    />;
                })}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '17px 25px 8px 25px',
                gap: '16px'
            }}>
                <Upload id="upload-input" accept="application/json" onSuccess={data => {
                    const parsedData = JSON.parse(data);
                    setResumeData(parsedData);
                    localStorage.setItem('game_data', data);
                    props.setModalContent(getResumeContent(parsedData));
                }} onError={() => {
                    showAlert('copied', 'Failed to upload file', <div/>);
                }}/>
                <Button
                    className={`btn-solid ${props.scale}`}
                    style={{
                        flexGrow: 1,
                        flexBasis: '25%',
                        maxWidth: '222px'
                        // minWidth: props.scale.includes('sm') ? '175px' : '250px'
                    }}
                    icon={resumeData ? <div/> : <UploadOutlined/>}
                    onClick={() => {
                        if (resumeData) {
                            props.setModalContent(getResumeContent(resumeData))
                        } else {
                            const upload = document.getElementById('upload-input') as HTMLInputElement;
                            if (upload) {
                                upload.click();
                            }
                        }
                    }}
                >
                    {resumeData ? getString('lobby.resume') : getString('lobby.load')}
                </Button>
                <Button
                    className={`btn-solid ${props.scale}`}
                    style={{
                        opacity: startVisible ? 1 : 0,
                        pointerEvents: startVisible ? 'auto' : 'none',
                        flexGrow: 1,
                        flexBasis: '25%',
                        maxWidth: '222px'
                        // minWidth: props.scale.includes('sm') ? '175px' : '250px'
                    }}
                    onClick={() => initGameData()}
                    iconRight={<ArrowRightOutlined/>}
                >
                    {getString('lobby.start')}
                </Button>
            </div>
            {React.createElement(CreditsSection, {...props, getString: getString})}
        </div>
    </>);

    // TODO: Credits Section - Finish SVGs and styles
    // TODO: Fix container sizing and scrolling on differing screen sizes
    // TODO: Crate HELP Sections for each game
    // TOD: Fix overlay on resume game
}

export default Lobby;