import { ArrowLeftOutlined } from "@ant-design/icons";
import cytoscape from "cytoscape";
import d3Force from "cytoscape-d3-force";

import CytoscapeComponent from "react-cytoscapejs";
import React, {useEffect, useRef, useState} from "react";
import {CYTOSCAPE_STYLESHEET} from "./constants";
import {getRandomItemFromArray} from "./utils";
import {Actor, Dict, Film, GameData, HowToPlayButtonProps} from "./types";
import {getProfileImage} from "./api/tmdb";
import DynamicButton from "../elements/DynamicButton";
import CompassIcon from "../elements/CompassIcon";
import Button from "../elements/Button";
import Unselectable from "../elements/Unselectable";
import find from "../utils";
import SelectedNode from "./SelectedNode";
import GuideText from "./GuideText";

cytoscape.use(d3Force);

function getLayoutConfig() {
    // const root = document.querySelector(".__________cytoscape_container");
    //
    // let windowWidth = window.innerWidth;
    // let windowHeight = window.innerHeight - 60;
    // let width = root ? Math.min(root.clientWidth, windowWidth) : windowWidth;
    // let height = root ? Math.min(root.clientHeight, windowHeight) : windowHeight;

    return {
        name: 'd3-force',
        animate: true,
        fit: true,
        maxSimulationTime: 2000,
        linkId: (data: { id: string }) => data.id,
        linkDistance: 85,
        linkStrength: () => 0.3,
        xX: 0.5,
        // xStrength: width > height ? 0 : height / width / 10,
        // yStrength: height > width ? 0 : width / height / 10,
        yY: 0.5,
        velocityDecay: 0.6,
        collideRadius: 3,
        collideStrength: 1,
        manyBodyStrength: -1000
    };
}

type Node = {
    data: {
        id: string,
        key: string,
        label: string,
        image: string,
        shape: string,
        borderColor: string,
        backgroundColor: string,
        opacity: number,
        borderWidth: number
    },
    selected: boolean | undefined,
    position?: { x: number, y: number }
}

type NodeData = {
    type: string,
    key: string,
    id: number,
    image_path: string,
    neighbour_ids: Array<number>
}

type CytoscapeProps = {
    data: GameData,
    mobile: boolean
    showHowToPlay: boolean
    setShowHowToPlay: ((newValue: boolean) => void)
    HowToPlayButton: ((props: HowToPlayButtonProps) => React.JSX.Element)
}

const Cytoscape = (props: CytoscapeProps) => {
    const [foundActors, setFoundActors] = useState<Dict<Actor>>(props.data.found.actors);
    const [foundFilms, setFoundFilms] = useState<Dict<Film>>(props.data.found.films);
    const [answersActors, setAnswersActors] = useState<Dict<Actor>>(props.data.answers.actors);
    const [answersFilms, setAnswersFilms] = useState<Dict<Film>>(props.data.answers.films);
    const [alternateTitles, setAlternateTitles] = useState(props.data.filmMap);

    // const [width, setWidth] = useState<number>(window.innerWidth);
    // const [height, setHeight] = useState<number>(window.innerHeight - 60);
    // const [keyboardUpHeight, setKeyboardUpHeight] = useState<number>(height);
    // const [mobileKeyboardActive, setMobileKeyboardActive] = useState<boolean>(false);

    const cyRef = useRef<cytoscape.Core | null>(null);
    const [layoutConfig, setLayoutConfig] = useState(getLayoutConfig());

    const [selectedNode, setSelectedNode] = useState<{id: string, key: string} | null>(null);
    const [hints, setHints] = useState<Map<string, string>>(new Map());
    const [elements, setElements] = useState<Array<Node>>(genElements(null));

    let layout: cytoscape.Layouts | null = null;

    function handleWindowSizeChange() {
    //     setTimeout(function() {
    //         if (window.visualViewport) {
    //             setWidth(window.visualViewport.width);
    //             setHeight(window.visualViewport.height - 60);
    //             setKeyboardUpHeight(
    //                 Math.min(keyboardUpHeight, window.visualViewport.height - 60)
    //             );
    //         }
            const core = cyRef.current;
            if (layout && core) {
                console.log('RENDER');
                setLayoutConfig(getLayoutConfig());
                core.resize();
                core.fit(core.elements());
            }
    //     }, 75);
    }
    //
    // function handleScroll() {
    //     if (mobileKeyboardActive) {
    //         window.scrollTo(0, 0);
    //     }
    // }

    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);
    //     window.addEventListener("scroll", handleScroll);
        return function cleanup() {
            window.removeEventListener("resize", handleWindowSizeChange);
    //         window.removeEventListener("scroll", handleScroll);
        };
    });

    function genElements(newNode: NodeData | null): Array<Node> {
        const elements: Array<Node> = [];
        const xs: Array<number> = [];
        const ys: Array<number> = [];
        let newX = 0;
        let newY = 0;

        if (newNode != null) {
            if (newNode.id === -3) {
                newNode.neighbour_ids = [-1, -2];
            }
            newNode.neighbour_ids.forEach(nid => {
                const neighbourID = newNode.type === "film" ? `a${nid}` : `f${nid}`;
                const core = cyRef.current;
                if (core) {
                    const pos = core.getElementById(neighbourID).position();
                    xs.push(pos["x"]);
                    ys.push(pos["y"]);
                }
            });
            newX = xs.reduce((a, b) => a + b) / xs.length;
            newY = ys.reduce((a, b) => a + b) / ys.length;
            if (xs.length === 1) {
                while (newX === xs[0] && newY === ys[0]) {
                    newX = getRandomItemFromArray([
                        xs[0] + 75,
                        xs[0],
                        xs[0] - 75
                    ]);
                    newY = getRandomItemFromArray([
                        ys[0] - 100,
                        ys[0],
                        ys[0] + 100
                    ]);
                }
            }
        }

        for (const [key, actor] of Object.entries(foundActors)) {
            const nodeID = "a" + actor.id;
            // const isStart = actor.id === props.gameInitData.start.id || actor.id === props.gameInitData.end.id;
            const element: Node = {
                data: {
                    id: nodeID,
                    key: key,
                    label: actor.name,
                    image: getProfileImage(actor.profile_path ? actor.profile_path : ''),
                    shape: "rectangle",
                    borderColor: hints.has(nodeID) ? "#5E51AE" : "#fff",
                    backgroundColor: "#fff",
                    opacity: 1,
                    borderWidth: 1
                },
                selected: !!(selectedNode && nodeID === selectedNode.id)
            };
            if (
                newNode !== null &&
                newNode.type === "actor" &&
                newNode.id === actor.id
            ) {
                element.position = { x: newX, y: newY };
            }
            elements.push(element);
        }

        for (const [key, film] of Object.entries(foundFilms)) {
            const nodeID = "f" + film.id;
            const element: Node = {
                data: {
                    id: nodeID,
                    key: key,
                    label: film.title,
                    image: getProfileImage(film.poster_path ? film.poster_path : ''),
                    shape: "rectangle",
                    borderColor: hints.has(nodeID) ? "#5E51AE" : "#fff",
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    opacity: 1
                },
                selected: !!(selectedNode && nodeID === selectedNode.id)
            };
            if (
                newNode != null &&
                newNode.type === "film" &&
                newNode.id === film.id
            ) {
                element.position = { x: newX, y: newY };
            }
            elements.push(element);

            // TODO: Generate Links
        }

        return elements;
    }

    function nodeToKey(node: any) {
        return node._private.map.entries().next().value[1].ele._private.data;
    }

    const handleSelectedNode = () => {
        if (cyRef.current) {
            const selected = cyRef.current.$("node:selected");
            const nodeKey = nodeToKey(selected);
            setSelectedNode(nodeKey);
        }
    };

    const handleUnselectedNode = () => {
        setSelectedNode(null);
        if (cyRef.current) {
            const selected = cyRef.current.$("node:selected");
            selected.unselect();
        }
    };

    const setSelectedNodeFromOutsideGraph = (nodeId: string) => {
        if (cyRef.current) {
            cyRef.current.$("node:selected").unselect();
            cyRef.current.getElementById(nodeId).select();
        }
    };

    // TODO: Back to main Menu
    return (<>
        <div style={{position: "absolute", top: 18, left: 18, zIndex: 2}}>
            {<DynamicButton
                mobile={false}
                showIcon={props.mobile}
                icon={<ArrowLeftOutlined/>}
                label={'Back'}
                onClick={() => {}}
            />}
        </div>
        <div style={{position: "absolute", top: 18, right: 18, zIndex: 2}}>
            {<props.HowToPlayButton mobile={false} showIcon={props.mobile}/>}
        </div>
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '15px'
            }}>
                <Unselectable style={{padding: 0}}>
                    <h3 className="game-header">
                        {'Connect '}
                        {props.data.requires.map((item, ix) => {
                            // TODO: Change to button
                            return <>
                                <button
                                    className="game-header-link"
                                    style={{
                                        display: 'inline',
                                        background: 'transparent',
                                        border: 'transparent',
                                        borderWidth: 0
                                    }}
                                    onClick={() => setSelectedNodeFromOutsideGraph(`a${item.id}`)}
                                >
                                    {item.name}
                                </button>
                                {ix < props.data.requires.length - 2 ? ', ' : ''}
                                {ix < props.data.requires.length - 1 ? ' and ' : ''}
                            </>
                        })}
                    </h3>
                </Unselectable>
            </div>
            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                <CytoscapeComponent
                    cy={cy => {
                        cyRef.current = cy
                        cy.on("select", "node", function(event) {
                            //@ts-ignore
                            clearTimeout(cy.nodesSelectionTimeout);
                            //@ts-ignore
                            cy.nodesSelectionTimeout = setTimeout(
                                handleSelectedNode,
                                100
                            );
                        });
                        cy.on("tapunselect", "node", function(event) {
                            //@ts-ignore
                            clearTimeout(cy.nodesSelectionTimeout);
                            //@ts-ignore
                            cy.nodesSelectionTimeout = setTimeout(
                                handleUnselectedNode,
                                100
                            );
                        });
                        layout = cy.layout(layoutConfig)
                    }}
                    elements={elements}
                    style={{width: "100%", flexGrow: 1}}
                    layout={layoutConfig}
                    maxZoom={3}
                    minZoom={0.6}
                    stylesheet={CYTOSCAPE_STYLESHEET}
                />
                <div style={{position: 'relative'}}>
                    <div style={{position: "absolute", bottom: 17, left: 18, zIndex: 2}}>
                        <Button
                            className="btn-solid"
                            icon={<CompassIcon/>}
                            onClick={() => {
                                if (layout)
                                    layout.run();
                                const core = cyRef.current;
                                if (core)
                                    core.fit(core.elements());
                            }}
                        />
                    </div>
                    {!props.mobile ? <GuideText/> : null}
                    {selectedNode && (
                        <SelectedNode
                            selectedNode={selectedNode}
                            foundActors={foundActors}
                            foundFilms={foundFilms}
                            setSelectedNode={setSelectedNodeFromOutsideGraph}
                            handleUnselectedNode={handleUnselectedNode}
                        />
                    )}
                </div>
            </div>
            <footer>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    flexShrink: 0
                }}>
                    <input onBlur={(v) => {v.currentTarget.focus()}} autoFocus className='guess-input' placeholder='Guess a movie or actor...'/>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start'
                }}>
                    <div className='stat'>Stars Found: {Object.keys(foundActors).length}</div>
                    <div className='stat'>Films Found: {Object.keys(foundFilms).length}</div>
                    <div className='stat'>Best Path: ???</div>
                </div>
            </footer>
        </div>
    </>);
}

export default Cytoscape;