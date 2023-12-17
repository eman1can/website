import {CONSTELLATIONS_PARTICLE_OPTIONS} from "./constants";

export function getLayoutConfig() {
	const cytoscape = document.querySelector(
		"#root > section > main > div > div:nth-child(5) > div > div > div.__________cytoscape_container"
	);
	const width = cytoscape
		? Math.min(cytoscape.clientWidth, window.visualViewport.width)
		: window.visualViewport.width;
	const height = cytoscape
		? Math.min(cytoscape.clientHeight, window.visualViewport.height)
		: window.visualViewport.height;
	return {
		name: "d3-force",
		animate: true,
		fit: true,
		maxSimulationTime: 2000,
		linkId: data => data.id,
		linkDistance: 85,
		linkStrength: () => 0.3,
		xX: 0.5,
		xStrength: width > height ? 0 : height / width / 10,
		yStrength: height > width ? 0 : width / height / 10,
		yY: 0.5,
		velocityDecay: 0.6,
		collideRadius: 3,
		collideStrength: 1,
		manyBodyStrength: -1000
	};
}

export function getParticlesConfig() {
	const particleWrapper = document.querySelector(
		"#root > section > main > div > div.frame-layout__particles-container"
	);
	const width = particleWrapper
		? particleWrapper.clientWidth
		: window.innerWidth;
	const height = particleWrapper
		? particleWrapper.clientHeight
		: window.innerHeight;
	const particleConfig = CONSTELLATIONS_PARTICLE_OPTIONS;
	particleConfig["particles"]["number"]["value"] = (width * height) / 17500;
	return particleConfig;
}
