import { GameData, HowToPlayButtonProps } from "./types";
import useLocalStorage from "./local_storage";
import React, { useEffect, useRef } from "react";
import { getProfileImage } from "./api/tmdb";

type GameProps = {
    mobile: boolean,
    showHowToPlay: boolean,
    setShowHowToPlay: ((newState: boolean) => void),
    HowToPlayButton: (props: HowToPlayButtonProps) => React.JSX.Element,
    data: GameData
}

class Node extends HTMLCanvasElement {
    x: number
    y: number

    width: number
    height: number

    dragging: boolean

    img: HTMLImageElement

    constructor() {
        super();

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.dragging = false;

        this.img = new HTMLImageElement();
    }

    onmousedown = function () {

    }
}
//
// type Node = {
//     x: number
//     y: number
//     img: HTMLImageElement
//     width: number
//     height: number
//     dragging: boolean
// }

function drawNode(ctx: CanvasRenderingContext2D, node: Node) {
    ctx.fillStyle = '#fff';
    ctx.rect(node.x - 2, node.y - 2, node.width + 4, node.height + 4);
    ctx.fill();
    if (node.img.loading) {
        node.img.onload = function () {
            ctx.drawImage(node.img, node.x, node.y, node.width, node.height);
        }
    } else {
        ctx.drawImage(node.img, node.x, node.y, node.width, node.height);
    }
}

type CanvasProps = {
    lines: React.RefObject<HTMLCanvasElement>
    nodes: React.RefObject<HTMLCanvasElement>
    interact: React.RefObject<HTMLCanvasElement>
    style: object
}

const Canvas = ({lines, nodes, interact, style}: CanvasProps) => {
    return (<div style={style}>
        <canvas ref={lines} width={window.innerWidth} height={window.innerHeight} style={style}/>
        <canvas ref={nodes} width={window.innerWidth} height={window.innerHeight} style={style}/>
        <canvas ref={interact} width={window.innerWidth} height={window.innerHeight} style={style}/>
    </div>);
}

const Game = (props: GameProps) => {
    const [data, setData] = useLocalStorage<GameData>('game_data', props.data);

    const canvas_lines = useRef<HTMLCanvasElement>(null);
    const canvas_nodes = useRef<HTMLCanvasElement>(null);
    const canvas_interact = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const elements: Array<Node> = [];
        let x = window.innerWidth / 2 - 200;
        let y = window.innerHeight / 2 - 75;
        Object.values(data.actors).forEach(actor => {
            const img = new Image();
            img.src = getProfileImage(actor.profile_path ? actor.profile_path : '');
            const node = new Node();
            node.x = x;
            node.y = y;
            node.width = 100;
            node.height = 150;
            node.dragging = false;
            elements.push(node);
            x += 300;
        });

        if (canvas_nodes) {
            const canvas = canvas_nodes.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    elements.forEach(n => drawNode(ctx, n));
                }
            }
        }
    }, [canvas_nodes]);

    return (<div>
        <Canvas lines={canvas_lines} nodes={canvas_nodes} interact={canvas_interact} style={{
            width: `${window.innerWidth}px`,
            height: `${window.innerHeight}px`,
            position: 'absolute',
            overflow: 'hidden'
        }}/>
    </div>);
}

export default Game;