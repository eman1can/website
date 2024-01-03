import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import * as d3 from 'd3';
import { Simulation, SimulationNodeDatum } from "d3";

const images: string[] = [
    'Amit Itzhaki.jpg',
    'Emma Rose Forman.jpg',
    'Faith Colon.jpg',
    'Kate Thompson.jpg',
    'Jessica Faith Harris.jpg',
    '2Tlg632tAkfZNlnoF8CV8F9Pf63.jpg',
    '6P8sa2eR2wpNkA1n1NVHREaeXPV.jpg',
    '8ur4aHFakVCinWk0cvrGO8qAUhv.jpg',
    'b0diEOPPAxOOInWOP9koaqvqUvi.jpg',
    'cbFVl9NWREa0xD2vW9Z3J4ursiu.jpg',
    'i2HIJQcBsUQ3o9HwEeDwou45D60.jpg',
    'mWltuVJirQWk4INKIUdiRvyzGQ0.jpg',
    'rSUjb8daxVleVIImFt0CzN4XyZ7.jpg',
    's9DpsGapfJAM2DyuhE2VBW1cKQw.jpg',
    'vQwtxPZckl5z7A2ed0LVF7WKdy9.jpg'
].map(src => `${process.env.PUBLIC_URL}/img/${src}`);

class Node {
    id: string
    index?: number
    img: HTMLImageElement

    x: number
    y: number

    fx?: number
    fy?: number
    vx?: number
    vy?: number

    active: boolean

    constructor(id: string, src: string, width: number, height: number, x: number, y: number) {
        this.id = id;
        this.img = new Image(width, height);
        this.img.src = src;
        this.x = x;
        this.y = y;
        this.active = false;
    }
}

interface Link extends SimulationNodeDatum {
    source: Node,
    target: Node
}

type Options = {
    distance: number,
    size: number
}

class Graph {
    nodes: Node[]
    links: Link[]
    simulation: d3.Simulation<Node, Link>
    width: number
    height: number

    constructor(opts: Options, canvas: HTMLCanvasElement, width: number, height: number) {
        this.nodes = [];
        this.links = [];
        this.width = width;
        this.height = height;

        const off = opts.distance / 2 + opts.distance * (3 - 2) / 2;
        let x = window.innerWidth / 2 - off;
        let y = window.innerHeight / 2;
        for (const src of images.slice(0, 3)) {
            console.log('Node', src);
            this.nodes.push(new Node(src, src, opts.size, 3 / 2 * opts.size, x, y));
            x += opts.distance;
        }

        this.simulation = d3
            .forceSimulation<Node>(this.nodes)
            .force('link',
                d3.forceLink<Node, Link>(this.links)
                    .id(d => d.id)
                    .strength(0.1)
                    .distance(100)
            )
            .force('charge',
                d3.forceManyBody()
                    .strength(-1000)
                    .distanceMin(0)
                    .distanceMax(opts.distance * 1.25)
            );

        d3.select<HTMLCanvasElement, Node>(canvas)
            .call(d3.drag<HTMLCanvasElement, any>()
                .subject(event => {
                    let subject = null;
                    let distance = 10000;
                    for (const node of this.nodes) {
                        let d = Math.hypot(event.x - node.x, event.y - node.y);
                        if (d < distance) {
                            distance = d;
                            subject = node;
                        }
                    }
                    return subject;
                })
                .on('start', this.dragStart)
                .on('drag', this.dragMove)
                .on('end', this.dragEnd))

        this.simulation.on('tick', () => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                console.log('Tick');
                // Draw Background
                // TODO: Investigate not drawing every tick
                // ctx!.clearRect(0, 0, this.width, this.height);

                ctx!.save();
                ctx!.globalAlpha = 0.6;
                ctx!.strokeStyle = '#999';
                ctx!.beginPath();
                this.links.forEach(link => {
                    ctx!.moveTo(link.source.x!, link.source.y!);
                    ctx!.lineTo(link.target.x!, link.target.y!);
                });
                ctx!.stroke();
                ctx!.restore();

                ctx!.save();
                ctx!.globalAlpha = 1;
                ctx!.strokeStyle = '#fff';
                ctx!.lineWidth = 2;
                this.nodes.forEach(n => {
                    ctx!.save();

                    ctx!.fillStyle = '#ff0000';
                    ctx!.strokeStyle = "#fff";
                    if (n.active)
                        ctx!.strokeStyle = '#000';

                    const h = opts.size * 3 / 2;
                    ctx!.translate(n.x! - opts.size / 2, n.y! - h / 2);
                    // ctx!.beginPath();
                    ctx!.moveTo(0, 0);
                    ctx!.rect(0, 0, opts.size, h);
                    // ctx!.lineTo(opts.size, 0);
                    // ctx!.lineTo(opts.size, h);
                    // ctx!.lineTo(0, h);
                    // ctx!.closePath();
                    ctx!.fill();
                    ctx!.stroke();
                    // ctx!.fillStyle = '#CCFF66';
                    // ctx!.rect(4, 4, opts.size - 8, h - 8);
                    // ctx!.fill();
                    // ctx!.fillStyle = '#ff0000';
                    ctx!.drawImage(n.img, 2, 2, opts.size - 4, h - 4);
                    ctx!.restore();
                })
                ctx!.restore();
            }
        });

        console.log('Simulation', this.simulation);
    }

    dragStart(event: d3.D3DragEvent<SVGCircleElement, Node, any>) {
        console.log('Drag start', this.simulation);
        // if (!event.active)
        //     this.simulation.alphaTarget(0.3).restart();
        // event.subject.x = event.subject.x;
        // event.subject.y = event.subject.y;
        event.subject.active = true;
        // event.subject.fx = null;
        // event.subject.fy = null;
    }

    dragMove(event: d3.D3DragEvent<SVGCircleElement, Node, any>) {
        console.log('Drag move', this.simulation);
        event.subject.x = event.x;
        event.subject.y = event.y;
    }

    dragEnd(event: d3.D3DragEvent<SVGCircleElement, Node, any>) {
        console.log('Drag end', this.simulation);
        // if (!event.active)
        //     this.simulation.alphaTarget(0);
        // event.subject.fx = null;
        // event.subject.fy = null;
        event.subject.active = false;
    }

    add(node: Node, link: Link) {
        this.nodes = this.nodes.concat(node);
        this.links = this.links.concat(link)

        this.simulation.nodes(this.nodes);
        // this.simulation.force('link')!.links(this.links);
        this.simulation.alpha(0.3).restart();
    }
}


const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [graph, setGraph] = useState<Graph | null>(null);

    // let addNode = () => {};

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ref = d3.
            const width = canvas.width;
            const height = canvas.height;
            console.log('Canvas useEffect', width, height);
            setGraph(new Graph({distance: 150, size: 100}, canvas, width, height))
        }
    }, [canvasRef]);

    const addNode = useCallback(() => {
        if (graph) {
            console.log('Add Node');
            // const nodes: Node[] = [];
            // const links: Link[] = [];
            //
            // let x = window.innerWidth / 2;
            // let y = window.innerHeight / 2;
            //
            // const src = images[Math.floor(Math.random() * images.length)];
            // nodes.push(new Node(src, src, 100, 3 / 2 * 100, x, y));
            //
            // simulation.nodes(nodes);
        }
    }, [graph]);

    console.log('Render');

    return <div style={{overflow: 'hidden', height: '100vh'}}>
        <canvas ref={canvasRef}/>
        <div style={{
            position: 'absolute',
            display: 'flex',
            top: 0,
            left: 0,
            flexDirection: 'column',
            padding: '20px'
        }}>
            <button onClick={addNode} style={{width: '100px', height: '30px'}}>Add Node</button>
        </div>
    </div>;
}

export default App;
