import { ArrowLeftOutlined } from "@ant-design/icons";
import cytoscape, { CollectionReturnValue, NodeCollection, NodeSingular } from "cytoscape";
import d3Force from "cytoscape-d3-force";

import CytoscapeComponent from "react-cytoscapejs";
import React, { useEffect, useRef, useState } from "react";
import { CYTOSCAPE_STYLESHEET } from "./constants";
import { getRandomItemFromArray, toGraphKey, numToWords, numToWordGuess, ObjectMap } from "./utils";
import { Dict, GameData, GameType, Path } from "./types";
import { Actor, AlternativeTitles, Film } from "./api/types";
import { getProfileImage, getData as apiGetData } from "./api/tmdb";
import DynamicButton from "../elements/DynamicButton";
import CompassIcon from "../elements/CompassIcon";
import Button from "../elements/Button";
import Unselectable from "../elements/Unselectable";
import { find } from "../utils";
import SelectedNode from "./SelectedNode";
import GuideText from "./GuideText";
import EnterIcon from "../elements/EnterIcon";
import HowToPlayButton from "../elements/HowToPlayButton";
import FuzzySet from "fuzzyset";
import { ModalProps } from "../elements/Modal";
import LogoHeader from "../elements/LogoHeader";
import useLocalStorage from "./local_storage";
import { useLocation } from "react-router-dom";

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
        label: string,
    } & ({
        image: string,
        shape: string,
        borderColor: string,
        backgroundColor: string,
        borderWidth: number
        opacity: number,
        importance?: number,
    } | {
        source: string,
        target: string,
        lineColor: string,
        width: number
    }),
    selected?: boolean,
    position?: { x: number, y: number }
}

type NodeData = {
    id: string,
    image: string,
    neighbour_ids: Array<string>
}

type InstructionTitleProps = {
    mode: string
    mobile: boolean
    actors: Array<{ id: string, name: string }>
    onClick: (key: string) => void
}

const InstructionHeader = (props: Readonly<InstructionTitleProps>) => {
    return (<div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '15px'
    }}>
        <h3 className="game-header  akkurat">
            <Unselectable className="game-header-text">
                {props.mobile ? 'Connect' : 'Can you connect'}
            </Unselectable>

            {props.mode === 'detour' ? (
                <>
                    <button
                        className="game-header-link"
                        onClick={() => props.onClick(props.actors[0].id)}
                    >
                        {props.actors[0].name}
                    </button>
                    <Unselectable className="game-header-text"> to </Unselectable>
                    <button
                        className="game-header-link"
                        onClick={() => props.onClick(props.actors[2].id)}
                    >
                        {props.actors[2].name}
                    </button>
                    <Unselectable className="game-header-text"> through </Unselectable>
                    <button
                        className="game-header-link"
                        onClick={() => props.onClick(props.actors[1].id)}
                    >
                        {props.actors[1].name}
                    </button>
                </>
            ) : (<>{
                props.actors.map((item, ix) => {
                    return <>
                        <button
                            className="game-header-link"
                            onClick={() => props.onClick(item.id)}
                            style={{paddingInlineEnd: '0'}}
                        >
                            {item.name}
                        </button>
                        {props.actors.length > 2 && ix <= props.actors.length - 2 ?
                            <Unselectable className="game-header-text"
                                          style={{paddingInlineStart: '0'}}>{', '}</Unselectable> : null}
                        {ix == props.actors.length - 2 ?
                            <Unselectable className="game-header-text">{' and '}</Unselectable> : null}
                    </>
                })
            }</>)}
            {props.mobile ? null : (
                <Unselectable className="game-header-text" style={{paddingInlineStart: '0'}}>?</Unselectable>)}
        </h3>
    </div>)
}

type CytoscapeProps = {
    scale: string
    setModalContent: (newContent: ModalProps | null) => void
    returnToLobby: () => void
}

const Cytoscape = (props: Readonly<CytoscapeProps>) => {
    const mobile = props.scale.startsWith('mobile');

    const [data, setData] = useLocalStorage<GameData>('game_data', {found: [], pool: {}, altTitles: {}, mode: '', subMode: '', requires: {}});

    const {pathname, search} = useLocation();

    const [found, setFound] = useState<Array<string>>(data.found);
    const [answers, setAnswers] = useState<Dict<GameType>>(data.pool);
    const [alternativeTitles, setAlternativeTitles] = useState<Dict<Array<string>>>(data.altTitles);
    const [bestPath, setBestPath] = useState<Path | undefined>(undefined);

    const [selectedNode, setSelectedNode] = useState<{ id: string, key: string } | null>(null);
    // const [hints, setHints] = useState<Map<string, string>>(new Map());
    const [elements, setElements] = useState<Array<Node>>([]);

    const [guess, setGuess] = useState<string>('');
    const [spellSuggestion, setSpellSuggestion] = useState<string | null>(null);
    const [suggestionOptions, setSuggestionOptions] = useState<FuzzySet>(FuzzySet([]));
    const [missingByKey, setMissingByKey] = useState<Dict<string>>({});
    const [fuzzyCheckTimeout, setFuzzyCheckTimeout] = useState<NodeJS.Timeout | null>(null);

    const cyRef = useRef<cytoscape.Core | null>(null);
    const [layoutConfig, setLayoutConfig] = useState(getLayoutConfig());
    const [refreshLayout, setRefreshLayout] = useState(false);

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

    function dijkstra(): [number, string[][] | null] {
        if (!cyRef.current)
            return [Infinity, null];

        type NodeInfo = { visited: boolean, distance: number, neighbors: Array<string>, name: string};

        const nodes: Dict<NodeInfo> = cyRef.current.nodes().reduce((d, n) => ({
            ...d, [n.id()]: {
                visited: false,
                distance: Infinity,
                name: n.data('label'),
                neighbors: n.neighborhood().filter(n => n.isNode()).map(n => n.id())
            }
        }), {});
        let required = Object.values(data.requires).reverse();

        // console.log('Required', required);
        // console.log('Nodes', nodes);

        // Start the algorithm at the first node
        let currentId = required.pop();
        if (!currentId)
            return [Infinity, null];

        // Set the distance of the starting required node to 0 and mark it as visited
        let current = nodes[currentId];
        nodes[currentId].distance = 0;

        // console.log(`Starting at node ${currentId} (${nodes[currentId].name})`);

        let currentDistance = 1;
        while (required.length > 0) {
            for (const id of current.neighbors) {
                // console.log(`Check Neighbor ${id} (${nodes[id].name})`);

                // If this neighbor is visited; skip
                if (nodes[id].visited)
                    continue;

                // We have no self-loops

                // Calculate New Distance For this Neighbor
                const d = nodes[id].distance;
                if (currentDistance < d) {
                    nodes[id].distance = currentDistance;
                    // console.log(`Found better path ${currentDistance} ${currentId} (${nodes[currentId].name}) → ${id} (${nodes[id].name})`);
                }

                // Mark any nodes that only have one neighbor (AKA current) as visited
                if (nodes[id].neighbors.length === 1)
                    nodes[id].visited = true;

                // If this neighbor is a required node, remove it from the required list
                const rix = required.indexOf(id);
                if (rix > -1) {
                    // console.log(`Found Required ${id} (${nodes[id].name}) at ${currentDistance}`);
                    required.splice(rix, 1);
                }
            }

            // Don't move to next node if we found all
            if (required.length === 0) {
                // console.log('Found all required nodes');
                break;
            }

            // Mark this node as visited
            nodes[currentId].visited = true;

            // Move to the lowest unvisited node
            let lowest: number = Infinity;
            for (const [id, n] of Object.entries(nodes)) {
                if (n.visited)
                    continue;

                if (n.distance < lowest) {
                    currentId = id;
                    lowest = n.distance;
                }
            }

            // If we can't find a path, return Infinity
            if (lowest === Infinity) {
                // console.log('Could not find a unvisited node within tree');
                return [Infinity, null];
            }

            // Query the next current node
            // console.log(`Moving to ${currentId} (${nodes[currentId].name})`);
            current = nodes[currentId];
            currentDistance = current.distance + 1;
        }

        // console.log('Found all required nodes');
        required = Object.values(data.requires);

        const paths: string[][] = [];
        let totalDistance: number = 0;
        for (const id of required.slice(1)) {
            current = nodes[id];
            currentId = id;
            const path: string[] = [];

            // console.log(`Start tracing from ${currentId} (${nodes[currentId].name})`);
            while (currentId != required[0]) {
                if (path.includes(currentId))
                    break;
                path.push(currentId);

                let lowest: number = Infinity;
                for (const n of current.neighbors) {
                    if (nodes[n].distance < lowest) {
                        lowest = nodes[n].distance;
                        currentId = n;
                    }
                }

                current = nodes[currentId];
                // console.log(`Move to ${currentId} (${nodes[currentId].name})`);
            }

            // Add the "End" node to path
            path.push(currentId);

            // console.log('Push path', path);
            paths.push(path.reverse());
            totalDistance += path.length;
        }

        totalDistance -= paths.length;

        return [totalDistance, paths];
    }

    function checkSuccess() {
        if (!cyRef.current)
            return;

        const [distance, paths] = dijkstra();
        console.log('Dijkstra', distance, paths);

        if (distance !== Infinity && paths !== null) {
            if (bestPath == null || distance < bestPath.distance) {
                const newBestPath = {path: paths, distance: distance, first: !bestPath, hintsUsed: 0};
                setBestPath(newBestPath);
                setData({...data, bestPath: newBestPath});

                handleUnselectedNode();
                props.setModalContent({
                    scale: '',
                    getString: s => s,
                    modalName: 'cts_Success',
                    onSuccess: () => {
                        localStorage.setItem('game_data', 'null');
                        const params = new URLSearchParams(search);
                        for (const k in params.keys())
                            params.delete(k)
                        props.returnToLobby();
                        props.setModalContent(null);
                    },
                    onCancel: () => props.setModalContent(null),
                    success: 'New Game',
                    cancel: 'Continue'
                });

                // Reset all edges
                cyRef.current.$('edge').data('width', 1).data('lineColor', '#fff');
                // Rest all nodes
                cyRef.current.$('node').data('importance', 1).data('borderColor', '#fff');

                for (const path of paths) {
                    for (const nodeId of path) {
                        if (!nodeId)
                            continue;
                        const node = cyRef.current.getElementById(nodeId);
                        node.data('importance', Object.values(data.requires).includes(nodeId) ? 3 : 2).data('borderColor', '#BCA356');
                        for (const edge of node.neighborhood().filter(n => n.isEdge()).toArray()) {
                            if (path.includes(edge.data('source')) && path.includes(edge.data('target'))) {
                                edge.data('width', 5).data('lineColor', '#BCA356');
                            }
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (layout && refreshLayout) {
            setTimeout(function () {
                if (layout) {
                    layout.run();
                    checkSuccess();
                }
            }, 75);
            setRefreshLayout(false);
        }
    }, [layout, refreshLayout]);

    function updateMissing() {
        const missing: Dict<string> = {};
        Object.entries(answers).forEach(([k, v]) => {
            if (!found.includes(k))
                missing[toGraphKey(v.name)] = k;
        });
        Object.keys(alternativeTitles).forEach(k => {
            alternativeTitles[k].forEach(v => {
                missing[toGraphKey(v)] = k;
            });
        });
        setMissingByKey(missing);
        setSuggestionOptions(FuzzySet(Object.keys(missing)));
    }

    useEffect(() => updateMissing(), [found, answers, alternativeTitles]);

    useEffect(() => {
        setElements(genElements(null));
        setRefreshLayout(true);
    }, [found, answers]);

    function genElements(newNode: NodeData | null): Array<Node> {
        const elements: Array<Node> = [];
        const xs: Array<number> = [];
        const ys: Array<number> = [];
        let newX = 0;
        let newY = 0;

        if (newNode != null) {
            newNode.neighbour_ids.forEach(neighbourID => {
                const core = cyRef.current;
                if (core) {
                    const pos = core.getElementById(neighbourID).position();
                    if (pos) {
                        xs.push(pos["x"]);
                        ys.push(pos["y"]);
                    }
                }
            });
            newX = xs.reduce((a, b) => a + b) / xs.length;
            newY = ys.reduce((a, b) => a + b) / ys.length;
            if (xs.length === 1) {
                while (newX === xs[0] && newY === ys[0]) {
                    newX = getRandomItemFromArray([xs[0] + 75, xs[0], xs[0] - 75]);
                    newY = getRandomItemFromArray([ys[0] - 100, ys[0], ys[0] + 100]);
                }
            }
        }

        const required = Object.values(data.requires);
        let onPath: string[] = [];
        if (bestPath)
            onPath = bestPath.path.flat();

        for (const nodeId of found) {
            const item = answers[nodeId];

            let importance = 1;
            const inPath = onPath.includes(nodeId);
            if (inPath)
                importance = 2;
            if (required.includes(nodeId))
                importance = 3;

            const element: Node = {
                data: {
                    id: nodeId,
                    label: item.name,
                    image: getProfileImage(item.image, mobile ? 'sm' : 'md'),
                    shape: "rectangle",
                    borderColor: inPath ? '#BCA356' : '#fff',
                    backgroundColor: '#fff',
                    opacity: 1,
                    borderWidth: 1,
                    importance: importance
                },
                selected: !!(selectedNode && nodeId === selectedNode.id)
            };
            if (newNode?.id.startsWith('a') && newNode?.id === item.id) {
                element.position = {x: newX, y: newY};
            }
            if (nodeId.startsWith('a')) {
                item.credits?.forEach(c => {
                    if (found.includes(c.id)) {
                        const edgeInPath = inPath && onPath.includes(c.id);
                        elements.push({
                            data: {
                                id: `${nodeId}-${c.id}`,
                                source: nodeId,
                                target: c.id,
                                label: '',
                                lineColor: edgeInPath ? '#BCA356' : '#fff',
                                width: edgeInPath ? 5 : 1
                            }
                        });
                    }
                });
            }
            elements.push(element);
        }

        return elements;
    }

    function nodeToKey(node: any) {
        return node._private.map.entries().next().value[1].ele._private.data;
    }

    const handleSelectedNode = () => {
        if (cyRef.current) {
            const selected = cyRef.current.$("node:selected");
            if (selected.length === 0)
                return;
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

    function afterAddNode(node: NodeData) {
        setElements(genElements(node));
        setRefreshLayout(true);

        const img = new Image();
        img.src = getProfileImage(node.image, "lg");
        img.onload = () => {
            setSelectedNodeFromOutsideGraph(node.id);
        };
    }

    function saveToStorage() {
        setData({...data, found: found, pool: answers, bestPath: bestPath});
    }

    function addNode(nodeId: string) {
        let promise: Promise<GameType>;
        if (answers[nodeId].credits) {
            promise = new Promise<GameType>(() => answers[nodeId]);
        } else {
            promise = apiGetData(answers[nodeId], true);
        }

        promise.then(item => {
            setAnswers(currentAnswers => {

                currentAnswers[nodeId] = item;
                item.credits?.forEach(c => {
                    // Don't overwrite actors/films we already have
                    if (!found.includes(c.id))
                        currentAnswers[c.id] = c;
                });
                return currentAnswers;
            });

            setFound(currentFound => {
                currentFound.push(nodeId);
                return currentFound;
            })

            setTimeout(() => {
                saveToStorage();
                updateMissing();
                afterAddNode({
                    id: item.id,
                    image: item.image,
                    neighbour_ids: item.credits?.map(c => c.id).filter(k => found.includes(k)) ?? []
                });
            }, 25);
        });

        // Update actor/film & credits
        // Add node to graph & call gen elements
        // Update best path
    }

    function executeSpellSuggest(key: string) {
        const result = suggestionOptions.get(key, null, 0.8);
        console.log('Spell Suggest', key, result);
        if (result !== null) {
            const key = missingByKey[result[0][1]];
            if (!found.includes(key)) {
                const item = answers[key];
                setSpellSuggestion(item.name);
            }
        }
    }

    function checkGuess(guess: string, onCorrect?: () => void) {
        const key = missingByKey[toGraphKey(guess)];
        if (!guess || !key)
            return;
        const onComplete = () => {
            if (fuzzyCheckTimeout != null)
                clearTimeout(fuzzyCheckTimeout);
            setSpellSuggestion(null);
        };
        const onIncorrect = () => setFuzzyCheckTimeout(setTimeout(() => executeSpellSuggest(key), 400));

        if (key in answers && !found.includes(key)) {
            addNode(key);
            onComplete();
            if (onCorrect)
                onCorrect();
        } else {
            onComplete();
            onIncorrect();
        }
    }

    function smartCheckGuess(guess: string) {
        checkGuess(guess, () => setGuess(''));

        const numGuess = numToWordGuess(guess);
        if (numGuess) {
            checkGuess(numGuess, () => setGuess(''));
        }
    }

    function onPressEnter() {
        if (guess === '')
            return;
        if (spellSuggestion != null) {
            checkGuess(spellSuggestion);
            setGuess('');
            setSpellSuggestion(null);
            return;
        }

        const key = toGraphKey(guess)
        if (key in answers) {
            checkGuess(guess);
        } else {
            executeSpellSuggest(key);
        }
    }

    const howToPlayContent = {
        scale: '',
        modalName: 'cts_HowToPlay',
        getString: (s: string) => s,
        onCancel: () => props.setModalContent(null),
        onSuccess: () => {},
        showClose: true
    };

    // TODO: Back to main Menu
    return (<>
        <div style={{position: "absolute", top: 18, left: 18, zIndex: 2}}>
            {<DynamicButton
                mobile={false}
                showIcon={mobile}
                icon={<ArrowLeftOutlined/>}
                label={'Back'}
                onClick={props.returnToLobby}
            />}
        </div>
        <div style={{position: "absolute", top: 18, right: 18, zIndex: 2}}>
            {<HowToPlayButton mobile={false} showIcon={mobile}
                              onClick={() => props.setModalContent(howToPlayContent)}/>}
        </div>
        {mobile ? null : (<div style={{position: 'absolute', top: 125, left: 18, zIndex: 2}}>
            {selectedNode && (
                <SelectedNode
                    selectedNode={selectedNode}
                    found={found}
                    pool={answers}
                    setSelectedNode={setSelectedNodeFromOutsideGraph}
                    handleUnselectedNode={handleUnselectedNode}
                />
            )}
        </div>)}
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
            {mobile ? null : <LogoHeader title="Connect the Stars"/>}
            <InstructionHeader
                mobile={mobile}
                mode={data.mode}
                actors={Object.values(data.requires).map(k => answers[k])}
                onClick={key => setSelectedNodeFromOutsideGraph(key)}
            />
            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                <CytoscapeComponent
                    cy={cy => {
                        cyRef.current = cy
                        cy.on("select", "node", function (event) {
                            //@ts-ignore
                            clearTimeout(cy.nodesSelectionTimeout);
                            //@ts-ignore
                            cy.nodesSelectionTimeout = setTimeout(
                                handleSelectedNode,
                                100
                            );
                        });
                        cy.on("tapunselect", "node", function (event) {
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
                    <div style={{position: "absolute", bottom: 17, left: 18, zIndex: 2, height: '40px'}}>
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
                    {!mobile ? <GuideText/> : null}
                </div>
                {spellSuggestion ? (<div style={{position: 'relative'}}>
                    <div style={{
                        position: "absolute",
                        bottom: 17,
                        left: 18,
                        marginRight: '76px',
                        zIndex: 2,
                        height: '60px',
                        paddingRight: '20px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        fontSize: '12pt',
                        fontFamily: 'font-family: "Akkurat-Mono", Arial, Helvetica, sans-serif',
                        textTransform: 'uppercase',
                        backgroundColor: '#BCA356',
                    }}>
                        <div
                            style={{
                                flexGrow: 1,
                                textAlign: 'center',
                                padding: '0 16px'
                            }}
                        >
                            {`Did you mean "${spellSuggestion}"?`}
                        </div>
                        <Button
                            onClick={() => {
                                checkGuess(spellSuggestion, () => setGuess(''));
                                setSpellSuggestion(null);
                            }}
                            iconRight={<EnterIcon/>}
                            style={{
                                border: '1px solid #ffffff66'
                            }}
                        >
                            Yes
                        </Button>
                    </div>
                </div>) : null}
            </div>
            <footer>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    flexShrink: 0
                }}>
                    <input
                        onBlur={(v) => {
                            v.currentTarget.focus()
                        }}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                onPressEnter();
                            }
                        }}
                        value={guess}
                        onChange={event => {
                            const value = event.currentTarget.value;
                            setSpellSuggestion(null);
                            setGuess(value);
                            smartCheckGuess(value);
                        }}
                        autoFocus
                        className='guess-input'
                        placeholder='Guess a movie or actor...'
                    />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                }}>
                    <div className='stat'>Stars Found: {found.filter(f => f.startsWith('a')).length}</div>
                    <div className='stat'>Films Found: {found.filter(f => f.startsWith('f')).length}</div>
                    <div className='stat'>
                        Best Path: {bestPath ? bestPath.distance : '???'}
                        {bestPath ? (<Button onClick={() => props.setModalContent({
                            scale: '',
                            modalName: 'cts_Success',
                            getString: (s: string) => s,
                            onSuccess: () => {
                                props.returnToLobby();
                                props.setModalContent(null);
                            },
                            onCancel: () => props.setModalContent(null),
                            success: 'Lobby',
                            cancel: 'Continue'
                        })}>?</Button>) : null}
                    </div>
                </div>
            </footer>
        </div>
    </>);
}

export default Cytoscape;