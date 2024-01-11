import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';

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

    active: boolean // Is this element being moved
    selected: boolean // Is this element selected
    start: number

    constructor(id: string, src: string, width: number, height: number, x: number, y: number) {
        this.id = id;
        this.img = new Image();
        this.img.src = src;
        this.x = x;
        this.y = y;
        this.active = false;
        this.selected = false;
        this.start = 0;
    }
}

interface Link extends d3.SimulationNodeDatum {
    source: Node,
    target: Node
}

export const App = () => {
    const distance = 150;
    const size = 150;
    const width = window.innerWidth;
    const height = window.innerHeight - 60;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [simulation, setSimulation] = useState<d3.Simulation<Node, Link> | null>(null);
    // const [nodes, setNodes] = useState<Array<Node>>([]);
    // const [links, setLinks] = useState<Array<Link>>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;

        const dpi = devicePixelRatio;
        ctx.scale(dpi, dpi);

        let baseNodes: Node[] = [];
        const off = distance / 2 + distance * (3 - 2) / 2;
        let x = width / 2 - off;
        let y = height / 2;
        for (const src of images.slice(0, 3)) {
            console.log(src);
            baseNodes.push(new Node(src, src, size, size * 2 / 3, x, y));
            x += distance;
        }

        const sim = d3.forceSimulation<Node>(baseNodes)
            .force('link',
                d3.forceLink<Node, Link>()
                    .id(d => d.id)
                    .strength(0.001)
                    .distance(distance)
            )
            .force('charge',
                d3.forceManyBody()
                    .strength(-1000)
                    .distanceMin(0)
                    .distanceMax(distance * 2)
            );

        let transform = d3.zoomIdentity;
        function dragStart(event: d3.D3DragEvent<SVGCircleElement, Node, any>) {
            if (!event.active)
                sim.alphaTarget(0.3).restart();
            event.subject.start = new Date().getMilliseconds();
        }

        function dragMove(event: d3.D3DragEvent<SVGCircleElement, Node, any>) {
            event.subject.active = true;
            event.subject.selected = false;
            event.subject.x = event.x / transform.k - transform.x;
            event.subject.y = event.y / transform.k - transform.y;
        }

        function dragEnd(event: d3.D3DragEvent<SVGCircleElement, Node, any>) {
            if (!event.active)
                sim.alphaTarget(0);
            if (!event.subject.active && (new Date().getMilliseconds() - event.subject.start) < 100) {
                event.subject.selected = !event.subject.selected;
                for (const n of sim.nodes()) {
                    if (n === event.subject)
                        continue;
                    n.selected = false;
                }
            }
            event.subject.active = false;
        }

        function drawNode(n: Node) {
            if (ctx) {
                ctx.save();

                const h = size * 3 / 2;
                ctx.translate(n.x! - size / 2, n.y! - h / 2);

                ctx.beginPath();
                ctx.rect(0, 0, size, h);
                ctx.closePath();

                ctx.fillStyle = '#fff';
                ctx.fill();

                const insetOff = size / 50;
                ctx.drawImage(n.img, insetOff, insetOff, size - insetOff * 2, h - insetOff * 2);

                if (n.selected) {
                    ctx.strokeStyle = '#EDCF73';
                    ctx.lineWidth = insetOff * 3;
                    ctx.stroke();
                }

                if (n.active) {
                    ctx.beginPath();
                    const hoverOff = size / 10;
                    ctx.roundRect(-hoverOff, -hoverOff, size + hoverOff * 2, h + hoverOff * 2, 2);
                    ctx.closePath();

                    ctx.fillStyle = '#EDCF73';
                    ctx.globalAlpha = 0.6;
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        function drawLink(l: Link) {
            if (ctx) {
                ctx.save();

                ctx.strokeStyle = '#fff';
                ctx.lineWidth = size / 25;

                ctx.beginPath();
                ctx.moveTo(l.source.x, l.source.y);
                ctx.lineTo(l.target.x, l.target.y);
                ctx.closePath();
                ctx.stroke();

                ctx.restore();
            }
        }

        function drawGraph() {
            if (ctx) {
                ctx.save();

                ctx.clearRect(0, 0, width, height);

                ctx.translate(transform.x, transform.y);
                ctx.scale(transform.k, transform.k);

                ctx.globalAlpha = 1;

                const links = sim.force<d3.ForceLink<Node, Link>>('link')?.links();
                if (links)
                    links.forEach(l => drawLink(l));

                sim.nodes().forEach(n => drawNode(n));

                ctx.restore();
            }
        }

        d3.select<HTMLCanvasElement, Node>(canvas)
            .call(d3.drag<HTMLCanvasElement, any>()
                .subject(event => {
                    let subject = null;
                    const h = size * 3 / 2;
                    const x = event.x;
                    const y = event.y;
                    for (const node of sim.nodes()) {
                        const l = node.x - size / 2;
                        const t = node.y - h / 2;
                        if (l < x && x < l + size && t < y && y < t + h) {
                            subject = node;
                        }
                    }
                    return subject;
                })
                .on('start', dragStart)
                .on('drag', dragMove)
                .on('end', dragEnd));


        sim.on('tick', () => drawGraph());

        d3.select<HTMLCanvasElement, Node>(canvas).call(d3.zoom<HTMLCanvasElement, Node>()
            .scaleExtent([0.2, 2])
            .on('zoom', event => {
                transform = event.transform;
                drawGraph();
            })
        ).on("dblclick.zoom", null);

        setSimulation(sim);
    }, [canvasRef, width, height]);

    const addNode = useCallback(() => {
        if (!simulation)
            return;

        let n = simulation.nodes();
        let a = n[Math.floor(Math.random() * n.length)];
        const offx = [-distance, 0, distance][Math.floor(Math.random() * 3)];
        const offy = [-distance * 2, offx === 0 ? distance * 2 : 0, distance * 2][Math.floor(Math.random() * 3)];

        const src = images[Math.floor(Math.random() * images.length - 3) + 3];
        const node = new Node(src, src, size, size * 3 / 2, a.x + offx, a.y + offy);

        n = n.concat(node);
        // setNodes(n);
        simulation.nodes(n);

        const link: Link = {source: a, target: node};
        const linkForce = simulation.force<d3.ForceLink<Node, Link>>('link');
        let l = linkForce?.links();
        if (!l)
            l = [];

        l = l.concat(link);
        // setLinks(l);
        linkForce?.links(l);

        simulation.alpha(0.3).restart();
    }, [simulation]);

    console.log('Render');

    return <div style={{overflow: 'hidden', height: '100vh'}}>
        <canvas ref={canvasRef} width={width} height={height} style={{zIndex: 10000}}/>
        <div style={{
            position: 'absolute',
            display: 'flex',
            top: '70px',
            left: 0,
            flexDirection: 'column',
            padding: '20px'
        }}>
            <button onClick={addNode} style={{width: '100px', height: '30px', color: '#000'}}>Add Node</button>
        </div>
    </div>;
}

