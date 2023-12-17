import React, {KeyboardEvent, useState} from "react";
import find from "../utils";
import {getHeadshot, getProfileImage, searchActor} from "./api";

type Actor = {
    id: number,
    name: string,
    popularity: number,
    image: string
};

type SearchInputProps = {
    placeholder?: string,
    onSubmit: (() => void),
    changeSelected: ((value: number) => void),
    onValue: ((value: string) => void),
}

function SearchInput(props: SearchInputProps) {
    const [text, setText] = useState('');

    const onKey = (event: KeyboardEvent<HTMLInputElement>) => {
        const key = event.key;

        if (key === 'Enter')
            props.onSubmit();
        else if (key === 'ArrowUp')
            props.changeSelected(-1);
        else if (key === 'ArrowDown')
            props.changeSelected(1);
        else {
            console.log(event.key, event.keyCode);
        }

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
            console.log('Input', event.currentTarget.value);
        }
        }
    />;
}

type ActorSearchProps = {
    data: Array<Actor> | null,
    selected: number
};
function ActorSearch(props: ActorSearchProps) {
    let index = -1;
    return props.data ? (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyItems: 'flex-start'}}>
            {props.data.map(actor => {
                index++;
                return (<div className={`${index === props.selected && 'actor-selected'}`} style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyItems: 'flex-start',
                            padding: '5px 5px 5px 30px'
                        }}>
                    <img alt="Actor" src={getHeadshot(actor.image)} style={{borderRadius: '25px', width: '50px', 'height': '50px', margin: '0 24px 0 0'}}/>
                    <div style={{flexGrow: 1, textAlign: 'start', fontFamily: 'Akkurat-Mono', fontSize: '16px'}}>{actor.name}</div>
                </div>);
            })}
        </div>
    ) : null;
}

type BackgroundProps = { src?: string };
function Background({src}: BackgroundProps) {
    return <div className="background" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgb(0, 0, 0)), url(${src})`}}/>;
}

type ChooseForMeProps = {onClick: (() => void)};
function ChooseForMe(props: ChooseForMeProps) {
    return <button className="choose-for-me" onClick={props.onClick}>Choose For Me</button>;
}

type ClearActorProps = {onClick: (() => void)};
function ClearActor(props: ClearActorProps) {
    return <button className="btn clear-actor" onClick={props.onClick}>
        <span className="icon"><img alt="Close" src={find('assets/cts', 'close_black.svg')}/></span>
        <span>Clear</span>
    </button>;
}

function getRandomActor(): null {
    return null;
}

function filterActors(r: any, query: string): null | Actor[] {
    const data = r.data;

    const filteredForPhotos = data.results.filter(
        (star: any) => star.profile_path != null
    );

    if (query.toLowerCase() === "eric bai") {
        filteredForPhotos.push({name: "Eric Bai", id: -1, popularity: 0, profile_path: 'eric'});
    } else if (query.toLowerCase() === "amanda hum") {
        filteredForPhotos.push({name: "Amanda Hum", id: -2, popularity: 0, profile_path: 'amanda'});
    } else if (query.toLowerCase() === "ethan wolfe") {
        filteredForPhotos.push({name: "Ethan Wolfe", id: -3, popularity: 0, profile_path: 'ethan'});
    }

    if (filteredForPhotos.length > 0) {
        return filteredForPhotos.slice(0, 7).map((result: any) => {
            return {
                id: result.id,
                name: result.name,
                image: `${result.profile_path}`,
                popularity: result.popularity
            };
        });
    }

    return null;
}

type ActorContainerProps = { title: string }
function ActorContainer(props: ActorContainerProps) {
    const [data, setData] = useState<Actor | null>(null);
    const [search, setSearch] = useState<string | null>(null);
    const [options, setOptions] = useState<Array<Actor> | null>(null);
    const [selected, setSelected] = useState<number>(0);

    function onSearchValue(value: string) {
        if (value.trim() === search) { return; }

        const s = value.trim();
        setSearch(s);

        if (s === "") { setOptions(null); return; }
        if (s) {
            console.log(s);
            searchActor(s).then((r: any) => setOptions(filterActors(r, s))).catch((e: any) => { setOptions(null); console.error(e); });
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
            setData(options[selected]);
            setOptions(null);
            setSearch(null);
        }
    }

    return <div className="actor-container">
        {search ? null : <div className="title">{props.title}</div>}
        {data ? <Background src={getProfileImage(data.image)}/> : <Background/>}
        {options ? <ActorSearch data={options} selected={selected}/> : null}
        <div style={{flexGrow: 1}}/>
        {data ? <div style={{
            flexShrink: 0,
            padding: '8px 8px 0 8px',
            textAlign: 'center',
            fontFamily: 'Playfair-Display',
            fontSize: '2em'
        }}>{data.name}</div> : null}
        {data ? <div style={{
            flexShrink: 0,
            padding: '0 8px 8px 8px',
            textAlign: 'center',
            fontFamily: 'Playfair-Display',
            fontSize: '1.5em',
            fontVariant: 'small-caps',
        }}>{`Popularity ${data.popularity}`}</div> : null}
        {data ? null : <SearchInput
            placeholder="Enter a movie star's name"
            onSubmit={onSearchSubmit}
            onValue={onSearchValue}
            changeSelected={changeSelected}
        />}
        {data ? null : <ChooseForMe onClick={() => setData(getRandomActor())}/>}
        {data ? <ClearActor onClick={() => setData(null)}/> : null}
    </div>;

}

export default ActorContainer;