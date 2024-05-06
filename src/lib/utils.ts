import * as PIXI from 'pixi.js';
import Shape from './shape';
import type { ShapeJSON } from './shape';

/**
 * Represents a JSON object that describes a graphics object.
 */
export type GraphicsJSON = {
	type: 'graphics';
	commands: {
		function: string;
		arguments: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
	}[];
};

/**
 * Represents a JSON object that describes a container object.
 */
export type ContainerJSON = {
	type: 'container';
	containerOptions: Partial<PIXI.Container>;
	children: (GraphicsJSON | ContainerJSON)[];
};

/**
 * Represents a JSON object that describes an svg object.
 */
export type SVGJSON = {
	type: 'svg';
	options?: Partial<PIXI.Sprite>;
	svg: string;
};

/**
 * Draws circles for the control points of a curve on a PIXI.Graphics object.
 * @param {PIXI.Graphics} g - The PIXI.Graphics object to draw on.
 * @param {number[]} points - The coordinates of the control points.
 * @param {number} radius - The radius of the circles.
 */
function showControlPoints(g: PIXI.Graphics, points: number[], radius: number) {
	for (let i = 0; i < points.length; i += 2) {
		g.drawCircle(points[i], points[i + 1], radius);
	}
}

/**
 * Creates a PIXI.Graphics object based on the provided JSON data.
 * @param {GraphicsJSON} jsonData - The JSON data to create the graphics object from.
 * @returns A new PIXI.Graphics object.
 */
function graphicsFromJSON(jsonData: GraphicsJSON) {
	const graphics = new PIXI.Graphics();
	jsonData.commands.forEach(command => {
		if (command.function in graphics) {
			// Execute function with arguments
			(graphics as any)[command.function](...command.arguments); // eslint-disable-line @typescript-eslint/no-explicit-any
		} else {
			console.error(`Function "${command.function}" does not exist on PIXI.Graphics object.`);
		}
	});

	return graphics;
}

/**
 * Creates a PIXI.Container object based on the provided JSON data.
 * @param {ContainerJSON} jsonData - The JSON data to create the container object from.
 * @returns A new PIXI.Container object.
 */
function containerFromJSON(jsonData: ContainerJSON) {
	const container = new PIXI.Container();
	Object.assign(container, jsonData.containerOptions);

	jsonData.children.forEach(child => {
		if (child.type === 'graphics') {
			container.addChild(graphicsFromJSON(child));
		} else if (child.type === 'container') {
			container.addChild(containerFromJSON(child));
		}
	});

	return container;
}

/**
 * Creates a 
 */
function svgFromJSON(jsonData: SVGJSON) {
	const texture = PIXI.Texture.from(jsonData.svg);
	const sprite = new PIXI.Sprite(texture);

	for (const key in jsonData.options) {
		if (key in PIXI.DisplayObject.prototype) {
			propertySetter_DisplayObject(sprite, key, jsonData.options[key]); 
		} else {
			propertySetter_Sprite(sprite, key, jsonData.options[key]);
		}
	}

	return sprite;
}

function propertySetter_Sprite(obj: PIXI.Sprite, key: string, value: any) {
	if (key == 'anchor') {
		// extract the two anchor values from the array
		obj.anchor.x = value[0];
		obj.anchor.y = value[1];
	} else if (key in obj) {
		obj[key] = value;
	} else {
		console.error(`Property "${key}" does not exist on PIXI.Sprite.`);
	}
}

function propertySetter_DisplayObject(obj: PIXI.DisplayObject, key: string, value: any) {
	if (key == 'scale') {
		// extract the two scale values from the array
		obj.scale.x = value[0];
		obj.scale.y = value[1];
	} else if (key in obj) {
		obj[key] = value;
	} else {
		console.error(`Property "${key}" does not exist on PIXI.DisplayObject.`);
	}
}

/**
 * Creates a PIXI.Graphics or PIXI.Container object based on the provided JSON data.
 * @param {GraphicsJSON | ContainerJSON | ShapeJSON} jsonData - The JSON data to create the object from.
 * @returns A new PIXI.Graphics or PIXI.Container object.
 */
function objectFromJSON(
	jsonData: GraphicsJSON | ContainerJSON | ShapeJSON | SVGJSON
): PIXI.Graphics | PIXI.Container | Shape {
	if (jsonData.type === 'graphics') {
		return graphicsFromJSON(jsonData);
	} else if (jsonData.type === 'container') {
		return containerFromJSON(jsonData);
	} else if (jsonData.type === 'svg') {
		return svgFromJSON(jsonData);
	} else {
		return Shape.fromJSON(jsonData);
	}
}

export { showControlPoints, graphicsFromJSON, containerFromJSON, objectFromJSON, svgFromJSON };