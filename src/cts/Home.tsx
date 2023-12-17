import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {isNormalInteger} from "./utils";
import {GameTypes} from "./games";


import {
    InfoCircleFilled,
} from "@ant-design/icons";

import {useMobile} from "../mobile";
import DynamicButton from "../elements/DynamicButton";
import useLocalStorage from "./local_storage";
import Lobby from "./Lobby";
import HowToPlayModal from "./HowToPlayModal";
import {Modal} from "antd";

const defaultGameData = {
    mode: 'classic',
    actors: [],
    titles: []
}

type LocalData = {
    seen: Set<number>,
    mobile: boolean,
    use_default: boolean,
    use_expanded: boolean,
    use_bollywood: boolean,
    use_blockbuster: boolean,
    block_movie_series: boolean
}

const defaultLocalData: LocalData = {
    seen: new Set(),
    mobile: false,
    use_default: true,
    use_expanded: false,
    use_bollywood: false,
    use_blockbuster: false,
    block_movie_series: false
}

type ParamData = {
    mode: string,
    one?: number,
    two?: number,
    max?: number,
    three?: number,
    four?: number,
    five?: number,
    six?: number,
    seven?: number,
    eight?: number,
    nine?: number,
    ten?: number
}

const defaultParamData: ParamData = {
    mode: 'classic'
}

const loadLocalData = (): LocalData => {
    let data: LocalData = defaultLocalData;

    // Load currently seen rolls
    try {
        const local_seen = localStorage.getItem('seen');
        data.seen = local_seen ? new Set(JSON.parse(local_seen)) : new Set();
    } catch (_) {
        data.seen = new Set();
    }

    // Load boolean options
    data.mobile = localStorage.getItem('mobile') === 'true' ?? false;
    data.use_default = localStorage.getItem('use_default') === 'true' ?? true;
    data.use_expanded = localStorage.getItem('use_expanded') === 'true' ?? false;
    data.use_bollywood = localStorage.getItem('use_bollywood') === 'true' ?? false;
    data.use_blockbuster = localStorage.getItem('use_blockbuster') === 'true' ?? false;
    data.block_movie_series = localStorage.getItem('block_movie_series') === 'true' ?? false;

    // Check for in-progress game


    // Ensure at least one actor set is used
    if (!data.use_default && !data.use_expanded && !data.use_bollywood && !data.use_blockbuster)
        data.use_default = true;

    // TODO: Adjust seen based upon set and options
    console.log(`Loaded Data:`, data);

    return data;
}

const useParamData = (defaultData: ParamData) => {
    const [data, setData] = useState(defaultData);
    const {pathname, search} = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const r: ParamData = defaultData;
        const mode = params.get('mode');

        if (mode) {
            const keys = Object.hasOwn(GameTypes, mode) ? GameTypes[mode] : GameTypes['classic'];
            for (const key of keys) {
                const p = params.get(key);
                if (p != null) {
                    if (isNormalInteger(p)) {
                        if (Object.hasOwn(r, key)) {
                            // @ts-ignore
                            r[key] = parseInt(p);
                        }
                    }
                }
            }
        }

        setData(r);
    }, [setData, defaultData, search]);

    function dispatch(data: ParamData) {

    }

    return [data, dispatch];
}


// const selectActor = (id: number, setActor, setLoading) => {
//     // Check if the selected actor is an easter egg
//     for (const actor of SecretActors) {
//         if (actor.id === id) {
//             setActor(actor);
//             return;
//         }
//     }
//
//     // Get actor details from TMDB
//     setLoading(true);
//     getActor(id)
//         .then(r => {
//
//         })
// }





type HowToPlayButtonProps = {
    mobile: boolean,
    showIcon?: boolean
}

const Home = () => {
    const mobile = useMobile();

    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const HowToPlayButton = (props: HowToPlayButtonProps) => {
        return <DynamicButton
            mobile={props.mobile}
            showIcon={props.showIcon}
            icon={<InfoCircleFilled/>}
            label="How To Play"
            onClick={() => setShowHowToPlay(true)}
        />;
    }

    const [gameData, setGameData] = useLocalStorage('game_data', defaultGameData);

    return (<>
        <HowToPlayModal
            visible={showHowToPlay}
            onCancel={() => setShowHowToPlay(false)}
        />
        {gameData ? (
            <Lobby
                mobile={mobile}
                showHowToPlay={showHowToPlay}
                setShowHowToPlay={setShowHowToPlay}
                HowToPlayButton={HowToPlayButton}
            />
        ) : (
            <div/>
        )}
    </>);
}

export default Home;