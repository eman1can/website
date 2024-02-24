import React, {KeyboardEvent, useEffect, useState} from "react";
import CloseIcon from "../elements/CloseIcon";
import {CircularProgress} from "@mui/joy";
import {toTitleCase} from "./utils";
import {ApiSearchActor} from "./api/api_types";
import {getHeadshot, getProfileImage, loadProfileImage, searchActor, getActor as apiGetActor} from "./api/tmdb";
import {Dict} from "./types";
import {Datasets} from "./datasets";
import {Film, Actor} from "./api/types";
import { readLocalStorage, readManyLocalStorage } from "./local_storage";


type SearchInputProps = {
    placeholder?: string
    onSubmit: (() => void)
    changeSelected: ((value: number) => void)
    onValue: ((value: string) => void)
}

function SearchInput(props: Readonly<SearchInputProps>) {
    const onKey = (event: KeyboardEvent<HTMLInputElement>) => {
        const key = event.key;

        if (key === 'Enter')
            props.onSubmit();
        else if (key === 'ArrowUp')
            props.changeSelected(-1);
        else if (key === 'ArrowDown')
            props.changeSelected(1);

        return false;
    }

    return <input
        className="actor-search akkurat"
        type="text"
        placeholder={props.placeholder}
        onKeyDown={(event) => onKey(event)}
        onInput={(event) => {
            const value = event.currentTarget.value;
            props.onValue(value);
        }}
    />;
}

type ActorSearchProps = {
    data: Array<Actor> | null,
    selected: number,
    showProfile: boolean,
    onSelected: (id: number) => void
};

function ActorSearch(props: Readonly<ActorSearchProps>) {
    return props.data ? (
        <div className="actor-search-container">
            {props.data.map((actor, index) => {
                return (<button
                    key={actor.id}
                    className={`actor-option ${index === props.selected ? 'actor-selected' : ''}`}
                    onClick={() => props.onSelected(index)}
                >
                    {props.showProfile ? <img
                        alt="Actor"
                        src={getHeadshot(actor.image ? actor.image : '')}
                        className="actor-headshot"
                    /> : null}
                    <div className="actor-name">{actor.name}</div>
                </button>);
            })}
        </div>
    ) : null;
}

type BackgroundProps = {
    src?: string
    className?: string
};

function Background({src, className}: Readonly<BackgroundProps>) {
    let style = {};
    if (src)
        style = {backgroundImage: `url(${src})`};// `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgb(0, 0, 0)), `}
    return <div className={`${className ?? "background"}`} style={style}/>;
}

type ChooseForMeProps = {
    title: string
    onClick: (() => void)
};

function ChooseForMe(props: Readonly<ChooseForMeProps>) {
    return <button className="choose-for-me akkurat" onClick={props.onClick}>{props.title}</button>;
}

type ClearActorProps = {
    title: string
    onClick: (() => void)
};

function ClearActor(props: Readonly<ClearActorProps>) {
    return (<button className="btn clear-actor" onClick={props.onClick} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className="icon" style={{width: '20px', height: '20px', marginRight: '25px'}}>
            <CloseIcon variant="dark"/>
        </div>
        <div style={{textAlign: 'center'}}>{props.title}</div>
    </button>);
}

function getRandomActor(options: Dict<boolean>): Promise<Actor> {
    let ids: Array<number> = [];
    for (const [key, value] of Object.entries(Datasets)) {
        if (options[key])
            ids = ids.concat(value);
    }

    const ix = Math.floor(Math.random() * ids.length);
    return apiGetActor({id: `a${ids[ix]}`});
}

const LoadingContainer = () => {
    return (<div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexGrow: 1
        }}
    >
        <CircularProgress
            color="neutral"
            determinate={false}
            size="lg"
            variant="soft"
        />
    </div>);
}

const ActorInfo = ({actor, getString}: { actor: Actor | null, getString: (key: string) => string }) => {
    if (!actor)
        return null;
    return (<div style={{
        flex: '0 0 0',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '20px'
    }} className="actor-info playfair">
        <div className="title-bar playfair">{actor.name}</div>
        <div className="subtitle-bar playfair">{`${getString('container.popularity')} ${actor.popularity}`}</div>
    </div>);
}

type ContainerProps = {
    scale: string
    title: string
    getString: (key: string) => string
    setItem: ((key: string, newItem: Actor | Film | null) => void)
    item: Actor | Film | null
    filter: ((r: Array<Actor | Film>, s: string) => Array<Actor | Film> | null)
}

// TODO: Make Non-profile display uniform
// TODO: Fix highlighting movement
function Container(props: Readonly<ContainerProps>) {
    const [search, setSearch] = useState<string | null>(null);
    const [options, setOptions] = useState<Array<Actor> | null>(null);
    const [selected, setSelected] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(false);

    const mobile = props.scale.includes('mobile');
    const disableProfile = readLocalStorage('disable_profile', false);

    useEffect(() => {
        if (props.item) {
            // TODO: Make loading wait for canvas load event
            // https://stackoverflow.com/questions/22788782/wait-for-background-images-in-css-to-be-fully-loaded
            setLoading(false);
            // loadProfileImage(props.item.image).then(() => setLoading(false));
        }
    }, [props.item]);

    function onSearchValue(value: string) {
        if (value.trim() === search) {
            return;
        }

        const s = value.trim();
        setSearch(s);

        if (s === "") {
            setOptions(null);
            return;
        }
        if (s) {
            searchActor(s).then((r: Array<Actor>) => setOptions(props.filter(r, s))).catch((e: any) => {
                setOptions(null);
                console.error(e);
            });
        }
    }

    const changeSelected = (value: number) => {
        if (options) {
            setSelected(Math.max(0, Math.min(selected + value, options.length + 1)));
        } else {
            setSelected(0);
        }
    }

    function onSearchSubmit() {
        if (options) {
            props.setItem(props.title, options[selected]);
            setOptions(null);
            setSearch(null);
        }
    }

    function setRandomActor() {
        setLoading(true);

        new Promise(resolve => setTimeout(resolve, 10)).then(() => {
            const datasetOptions: Dict<boolean> = readManyLocalStorage<boolean>(['use_default', 'use_expanded', 'use_bollywood', 'use_blockbuster'])
            getRandomActor(datasetOptions).then(actor => props.setItem(props.title, actor));
        });
    }

    return <div className={`actor-container ${props.scale}`}>
        {search ? null : <div className="slot-name akkurat">{props.title}</div>}
        {loading ? <LoadingContainer/> : (<>
            {props.item ? <Background src={getProfileImage(props.item.image, 'lg')}/> : <Background className='placeholder'/>}
            {options ? <ActorSearch data={options} selected={selected} showProfile={!disableProfile}
                                    onSelected={(index: number) => {
                                        props.setItem(props.title, options[index]);
                                        setOptions(null);
                                        setSearch(null);
                                    }}/> : null}
            <div style={{flexGrow: 1}}/>
            <ActorInfo actor={props.item} getString={props.getString}/>
            {props.item ? null : <SearchInput
                placeholder={mobile ? props.getString('container.enter_short') : props.getString('container.enter')}
                onSubmit={onSearchSubmit}
                onValue={onSearchValue}
                changeSelected={changeSelected}
            />}
            {props.item ? null : <ChooseForMe title={props.getString('container.choose')} onClick={() => setRandomActor()}/>}
            {props.item ? <ClearActor title={props.getString('container.clear')} onClick={() => props.setItem(props.title, null)}/> : null}
        </>)}
    </div>;

}

export default Container;