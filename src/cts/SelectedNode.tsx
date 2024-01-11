import React, {useState} from "react";
import {Card, ConfigProvider, List, Button, Popover} from "antd";
import {Actor, Dict, Film} from "./types";
import CloseIcon from "../elements/CloseIcon";
import {getProfileImage} from "./api/tmdb";

type CreditCardProps = {
    title: string
    dataSource: Array<{ id: string, title: string }>
    onClick: (id: string) => void
}

function CreditsCard(props: CreditCardProps) {
    const customizeRenderEmpty = () => (
        <div className="no-data">
            <p>No Data</p>
        </div>
    );

    return (
        <Card
            className="credits-card"
            bordered={false}
            title={props.title}
            size="small"
            style={{width: "100%", display: "flex", flexDirection: "column"}}
        >
            <div className="credits-list-container">
                <ConfigProvider renderEmpty={customizeRenderEmpty}>
                    <List
                        className="credits-list"
                        size="small"
                        dataSource={props.dataSource}
                        renderItem={item => (
                            <List.Item onClick={() => props.onClick(item.id)}>
                                <a
                                    className="list-link"
                                    href="#"
                                    onClick={() => props.onClick(item.id)}
                                >
                                    {item.title}
                                </a>
                            </List.Item>
                        )}
                    />
                </ConfigProvider>
            </div>
        </Card>
    );
}

type SelectedNodeProps = {
    selectedNode: { id: string, key: string }
    foundActors: Dict<Actor>
    foundFilms: Dict<Film>
    setSelectedNode: (id: string) => void
    handleUnselectedNode: () => void
}

function SelectedNode(props: SelectedNodeProps) {
    const key = props.selectedNode.key;
    const isActor = props.selectedNode.id[0] === 'a';

    let title = '';
    let src = '';
    const credits: Array<{id: string, title: string}> = [];

    if (isActor) {
        const actor = props.foundActors[key];
        title = actor.name;
        src = getProfileImage(actor.profile_path ? actor.profile_path : '');

    } else {
        const film = props.foundFilms[key];
        title = film.title;
        src = getProfileImage(film.poster_path ? film.poster_path : '');
        // credits = Object.keys(props.actor.credits)
        //     .filter(key => key in props.foundFilms)
        //     .reduce((arr, key) => {
        //         const toConcat = props.actor.credits[key].filter(film =>
        //             props.foundFilms[key].map(f => f.id).includes(film.id)
        //         );
        //         return arr.concat(toConcat);
        //     }, []);
    }

    return (
        <div
            className="selected-node-info"
            style={{
                position: "absolute",
                left: 18,
                bottom: 121,
                width: 202,
                borderColor: "#fff"
            }}
        >
            <div
                style={{
                    flexGrow: 1,
                    minHeight: "2em",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    width: "100%",
                    position: "relative"
                }}
            >
                <Button
                    style={{
                        position: "absolute",
                        top: 3,
                        right: 3
                    }}
                    onClick={props.handleUnselectedNode}
                    type="link"
                    icon={<CloseIcon/>}
                />
                <div
                    className="portrait"
                    style={{
                        backgroundImage: title
                            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0) 15% 66%, rgba(0,0,0,1)), url(${src})`
                            : `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0) 15%), url(${src})`,
                        backgroundSize: "100% auto"
                    }}
                >
                    <div style={{flexGrow: 1}}/>
                    {title && (
                        <div
                            style={{
                                paddingLeft: 6,
                                paddingRight: 6,
                                paddingBottom: 12,
                                flexShrink: 0
                            }}
                        >
                            {title}
                        </div>
                    )}
                </div>
            </div>
            <div
                style={{
                    flexGrow: 1,
                    minHeight: "2em",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    alignItems: 'stretch',
                    backgroundColor: '#14162E'
                }}
            >
                <div className='credits-title'>
                    - Films Found -
                </div>
                {credits.length === 0 ? (
                    <div className='credits-empty'>
                        None
                    </div>
                ) : (
                    <div className='credits-list-container'>
                        <div className='credits-list'>
                            {credits.map(({id, title}) => {
                                return (<button
                                    key={id}
                                    className='credits-list-item'
                                    onClick={() => props.setSelectedNode(id)}
                                >
                                    {title}
                                </button>);
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelectedNode;
