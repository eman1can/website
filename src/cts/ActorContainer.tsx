import React, { KeyboardEvent, useEffect, useState } from "react";
import CloseIcon from "../elements/CloseIcon";
import { CircularProgress } from "@mui/joy";
import { toTitleCase } from "./utils";
import { ApiActor, ApiSearchActor } from "./api/api_types";
import { getHeadshot, getProfileImage, loadProfileImage, searchActor, getActor as apiGetActor } from "./api/tmdb";
import { filterActors } from "./api/utils";
import { Actor, Dict } from "./types";
import { Datasets } from "./datasets";



type SearchInputProps = {
    placeholder?: string,
    onSubmit: (() => void),
    changeSelected: ((value: number) => void),
    onValue: ((value: string) => void),
}

function SearchInput(props: SearchInputProps) {
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
        className="actor-search"
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
    showProfile: boolean
};

function ActorSearch(props: ActorSearchProps) {
    let index = -1;
    return props.data ? (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyItems: 'flex-start'}}>
            {props.data.map(actor => {
                index++;
                return (<div key={actor.id} className={`${index === props.selected && 'actor-selected'}`} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyItems: 'flex-start',
                    padding: '5px 5px 5px 30px'
                }}>
                    {props.showProfile ? <img
                        alt="Actor"
                        src={getHeadshot(actor.profile_path ? actor.profile_path : '')}
                        style={{
                            borderRadius: '25px',
                            width: '50px',
                            height: '50px',
                            margin: '0 24px 0 0'
                        }}/> : null}
                    <div style={{
                        flexGrow: 1,
                        textAlign: 'start',
                        fontFamily: 'Akkurat-Mono',
                        fontSize: '16px'
                    }}>{actor.name}</div>
                </div>);
            })}
        </div>
    ) : null;
}

type BackgroundProps = { src?: string, className?: string };

function Background({src, className}: BackgroundProps) {
    let style = {};
    if (src)
        style = {backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgb(0, 0, 0)), url(${src})`}
    return <div className={`${className || "background"}`} style={style}/>;
}

type ChooseForMeProps = { onClick: (() => void) };

function ChooseForMe(props: ChooseForMeProps) {
    return <button className="choose-for-me" onClick={props.onClick}>Choose For Me</button>;
}

type ClearActorProps = { onClick: (() => void) };

function ClearActor(props: ClearActorProps) {
    return <button className="btn clear-actor" onClick={props.onClick}>
        <span className="icon"><CloseIcon variant="dark"/></span>
        <span>Clear</span>
    </button>;
}

function getRandomActor(options: Dict<boolean>): Promise<Actor> {
    let ids: Array<number> = [];
    for (const key of Object.keys(Datasets)) {
        if (options[key])
            ids = ids.concat(Datasets[key]);
    }

    const ix = Math.floor(Math.random() * ids.length);
    return apiGetActor({id: ids[ix]});
}


type ActorContainerProps = {
    title: string
    setActor: ((key: string, newActor: Actor | null) => void)
    actor: Actor | null
    showProfile: boolean
    filter: ((r: ApiSearchActor, s: string) => Array<Actor> | null),
    getOptions: (() => Dict<boolean>)
}

function ActorContainer(props: ActorContainerProps) {
    const [search, setSearch] = useState<string | null>(null);
    const [options, setOptions] = useState<Array<Actor> | null>(null);
    const [selected, setSelected] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (props.actor) {
            setLoading(true);
            loadProfileImage(props.actor?.profile_path ? props.actor?.profile_path : '').then(() => setLoading(false));
        }
    }, [props.actor]);

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
            searchActor(s).then((r: ApiSearchActor) => setOptions(props.filter(r, s))).catch((e: any) => {
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
            props.setActor(props.title, options[selected]);
            setOptions(null);
            setSearch(null);
        }
    }

    function setRandomActor() {
        setLoading(true);

        new Promise(resolve => setTimeout(resolve, 10)).then(() => {
            getRandomActor(props.getOptions()).then(actor => props.setActor(props.title, actor));
        });
    }

    const actor = props.actor;

    return <div className="actor-container">
        {search ? null : <div className="title">{toTitleCase(props.title)}</div>}
        {loading ? (<>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                flexGrow: 1
            }}>
                <CircularProgress
                    color="neutral"
                    determinate={false}
                    size="lg"
                    variant="soft"
                />
            </div>
        </>) : (<>
            {actor ? <Background src={getProfileImage(actor.profile_path ? actor.profile_path : '')}/> :
                <Background className='placeholder'/>}
            {options ? <ActorSearch data={options} selected={selected} showProfile={props.showProfile}/> : null}
            <div style={{flexGrow: 1}}/>
            {actor ? <div style={{
                flexShrink: 0,
                padding: '8px 8px 0 8px',
                textAlign: 'center',
                fontFamily: 'Playfair-Display',
                fontSize: '2em'
            }}>{actor.name}</div> : null}
            {actor ? <div style={{
                flexShrink: 0,
                padding: '0 8px 8px 8px',
                textAlign: 'center',
                fontFamily: 'Playfair-Display',
                fontSize: '1.5em',
                fontVariant: 'small-caps',
            }}>{`Popularity ${actor.popularity}`}</div> : null}
            {actor ? null : <SearchInput
                placeholder="Enter a movie star's name"
                onSubmit={onSearchSubmit}
                onValue={onSearchValue}
                changeSelected={changeSelected}
            />}
            {actor ? null : <ChooseForMe onClick={() => setRandomActor()}/>}
            {actor ? <ClearActor onClick={() => props.setActor(props.title, null)}/> : null}
        </>)}
    </div>;

}

export default ActorContainer;