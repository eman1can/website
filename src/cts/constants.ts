export const CYTOSCAPE_STYLESHEET = [
    {
        selector: "node",
        style: {
            "background-image": "data(image)",
            shape: "data(shape)",
            height: 'mapData(importance, 1, 3, 75, 112.5)',
            width: 'mapData(importance, 1, 3, 50, 75)',
            "background-fit": "cover",
            "border-color": "data(borderColor)",
            "background-color": "data(backgroundColor)",
            "background-image-opacity": "data(opacity)",
            "border-width": "data(borderWidth)",
            "border-opacity": 1,
            "overlay-color": "rgba(220, 182, 62, 0.47)"
        }
    },
    {
        selector: "edge",
        style: {
            "line-color": "data(lineColor)",
            width: "data(width)"
        }
    },
    {
        selector: ":selected",
        style: {
            "border-color": "#BCA356",
            "background-color": "#BCA356",
            "border-width": 3,
            "border-style": "solid"
        }
    }
];