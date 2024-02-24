import React from "react";
import {Card, ConfigProvider, List, Button} from "antd";
import {Dict, GameType} from "./types";
import CloseIcon from "../elements/CloseIcon";
import { getProfileImage } from "./api/tmdb";
import { toGraphKey } from "./utils";

type CreditCardProps = {
    title: string
    dataSource: Array<{ id: string, title: string }>
    onClick: (id: string) => void
}

function CreditsCard(props: Readonly<CreditCardProps>) {

    const RenderEmpty = () => {
        return (<div className="no-data">
            <p>No Data</p>
        </div>);
    }

    return (
        <Card
            className="credits-card"
            bordered={false}
            title={props.title}
            size="small"
            style={{width: "100%", display: "flex", flexDirection: "column"}}
        >
            <div className="credits-list-container">
                <ConfigProvider renderEmpty={RenderEmpty}>
                    <List
                        className="credits-list"
                        size="small"
                        dataSource={props.dataSource}
                        renderItem={item => (
                            <List.Item onClick={() => props.onClick(item.id)}>
                                <button
                                    className="list-link"
                                    onClick={() => props.onClick(item.id)}
                                >
                                    {item.title}
                                </button>
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
    pool: Dict<GameType>
    found: Array<string>
    setSelectedNode: (id: string) => void
    handleUnselectedNode: () => void
}

function SelectedNode(props: Readonly<SelectedNodeProps>) {
    const key = props.selectedNode.id;
    const isActor = key.startsWith('a');
    const item = props.pool[key];
    const credits = item.credits ? item.credits.filter(c => props.found.includes(c.id)) : [];

    const height = 600;

    return (
        <div
            className="selected-node-info"
            style={{
                width: height / 3 * 2 + 2,
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
                <div className="portrait"
                    style={{
                        height: height,
                        backgroundImage: isActor
                            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0) 15% 66%, rgba(0,0,0,1)), url(${getProfileImage(item.image, 'lg')})`
                            : `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0) 15%), url(${getProfileImage(item.image, 'lg')})`,
                        backgroundSize: "100% auto"
                    }}
                >
                    <div style={{flexGrow: 1}}/>
                    {isActor && (
                        <div
                            style={{
                                paddingLeft: 6,
                                paddingRight: 6,
                                paddingBottom: 12,
                                flexShrink: 0
                            }}
                        >
                            {item.name}
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
                {credits ? (
                    <div className='credits-list-container'>
                        <div className='credits-list'>
                            {credits.map((item: GameType) => {
                                return (<button
                                    key={item.id}
                                    className='credits-list-item'
                                    onClick={() => props.setSelectedNode(item.id)}
                                >
                                    {item.name}
                                </button>);
                            })}
                        </div>
                    </div>
                ) : (
                    <div className='credits-empty'>
                        None
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelectedNode;
