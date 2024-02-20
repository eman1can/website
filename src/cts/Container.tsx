import React, {KeyboardEvent, useEffect, useState} from "react";
import CloseIcon from "../elements/CloseIcon";
import {CircularProgress} from "@mui/joy";
import {toTitleCase} from "./utils";
import {ApiSearchActor} from "./api/api_types";
import {getHeadshot, getProfileImage, loadProfileImage, searchActor, getActor as apiGetActor} from "./api/tmdb";
import {Dict} from "./types";
import {Datasets} from "./datasets";
import {Film, Actor} from "./api/types";


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
        style = {backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgb(0, 0, 0)), url(${src})`}
    return <div className={`${className ?? "background"}`} style={style}/>;
}

type ChooseForMeProps = {
    onClick: (() => void)
};

function ChooseForMe(props: Readonly<ChooseForMeProps>) {
    return <button className="choose-for-me akkurat" onClick={props.onClick}>Choose For Me</button>;
}

type ClearActorProps = {
    onClick: (() => void)
};

function ClearActor(props: Readonly<ClearActorProps>) {
    return (<button className="btn clear-actor" onClick={props.onClick}>
        <span className="icon">
            <CloseIcon variant="dark"/>
        </span>
        <span>Clear</span>
    </button>);
}

function getRandomActor(options: Dict<boolean>): Promise<Actor> {
    let ids: Array<number> = [];
    for (const key of Object.keys(Datasets)) {
        if (options[key])
            ids = ids.concat(Datasets[key]);
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

const TitleBar = ({actor}: { actor: Actor | null }) => {
    if (!actor)
        return null;
    return (<div className="title-bar playfair">{actor.name}</div>);
}

const PopularityBar = ({actor}: { actor: Actor | null }) => {
    if (!actor)
        return null;
    return (<div className="subtitle-bar playfair">{`Popularity ${actor.popularity}`}</div>);
}

type ContainerProps = {
    scale: string
    title: string
    setItem: ((key: string, newItem: Actor | Film | null) => void)
    item: Actor | Film | null
    showProfile: boolean
    filter: ((r: Array<Actor | Film>, s: string) => Array<Actor | Film> | null),
    getOptions: (() => Dict<boolean>)
}

function Container(props: Readonly<ContainerProps>) {
    const [search, setSearch] = useState<string | null>(null);
    const [options, setOptions] = useState<Array<Actor> | null>(null);
    const [selected, setSelected] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(false);

    const mobile = props.scale.includes('mobile');

    useEffect(() => {
        if (props.item) {
            setLoading(true);
            loadProfileImage(props.item.image).then(() => setLoading(false));
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
            getRandomActor(props.getOptions()).then(actor => props.setItem(props.title, actor));
        });
    }

    return <div className={`actor-container ${props.scale}`}>
        {search ? null : <div className="title akkurat">{toTitleCase(props.title)}</div>}
        {loading ? <LoadingContainer/> : (<>
            {props.item ? <Background src={getProfileImage(props.item.image, 'lg')}/> :
                <Background className='placeholder'/>}
            {options ? <ActorSearch data={options} selected={selected} showProfile={props.showProfile}
                                    onSelected={(index: number) => {
                                        props.setItem(props.title, options[index]);
                                        setOptions(null);
                                        setSearch(null);
                                    }}/> : null}
            <div style={{flexGrow: 1}}/>
            <TitleBar actor={props.item}/>
            <PopularityBar actor={props.item}/>
            {props.item ? null : <SearchInput
                placeholder={mobile ? "Star's Name" : "Enter a movie star's name"}
                onSubmit={onSearchSubmit}
                onValue={onSearchValue}
                changeSelected={changeSelected}
            />}
            {props.item ? null : <ChooseForMe onClick={() => setRandomActor()}/>}
            {props.item ? <ClearActor onClick={() => props.setItem(props.title, null)}/> : null}
        </>)}
    </div>;

}

export default Container;