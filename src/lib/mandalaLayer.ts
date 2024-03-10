import * as PIXI from 'pixi.js';
import { get } from 'svelte/store';
import { globalTime } from '../store/timeStore';
import type Mandala from './mandala';
import type { ShapeJSON } from './shape';
import type { ContainerJSON, GraphicsJSON } from './utils';
import { objectFromJSON } from './utils';

export type MandalaLayerType = 'pattern' | 'container' | 'none';

export type MandalaLayerPattern = {
	itemGenerator: GraphicsJSON | ContainerJSON | ShapeJSON;
	itemCount: number;
	radius: number;
	offset?: number;
};

// create type description for the json object
export type MandalaLayerJSON = {
	name: string;
	type: 'mandalaLayer';
	layerType: MandalaLayerType;
	pattern?: MandalaLayerPattern;
	children?: (GraphicsJSON | ContainerJSON | ShapeJSON)[];
};

export default class MandalaLayer extends PIXI.Container {
	name: string;
	app: Mandala;
	// layerType: MandalaLayerType = 'none';
	// pattern?: MandalaLayerPattern;
	// container?: PIXI.Container;

	/**
	 * Create a MandalaLayer with a circular repeating pattern.
	 * @param {string} name - The name of the layer.
	 * @param {PIXI.Application} app - The application to which the layer has to be added
	 */
	constructor(name: string, app: Mandala) {
		super();
		this.name = name;
		this.app = app;
	}

	/**
	 * Build the pattern with multiple options.
	 * @param {Function} itemGenerator - The shape to add.
	 * @param {number} itemCount - Number of times the item is repeated.
	 * @param {number} radius - Radius of the circle.
	 * @param {number} [offset=0] Angle(radians) that the circle is rotated anti-clockwise.
	 */
	buildPattern(itemGenerator: (i: number) => PIXI.DisplayObject, itemCount: number, radius: number, offset: number = 0) {
		this.removeChildren();
		// this.layerType = 'pattern';
		// this.pattern = { itemGenerator: itemGenerator(0).toJSON(), itemCount, radius, offset };

		for (let i = 0; i < itemCount; i++) {
			const graphics = itemGenerator(i);

			const theta = (2 * 3.14 * i) / itemCount + offset;
			const x = radius * Math.cos(theta);
			const y = radius * Math.sin(theta);

			graphics.x = x;
			graphics.y = y;
			graphics.rotation += theta;
			this.addChild(graphics);
		}

		return this;
	}

	/**
	 * Animate the layer.
	 * @param {Function} tickerFunc - The function to be called on each tick.
	 * @param {number} startTime - The time at which the animation should start.
	 * @param {number} duration - The duration of the animation.
	 */
	addAnimation(
		tickerFunc: PIXI.TickerCallback<MandalaLayer>,
		startTime: number = 0,
		duration: number = Infinity
	) {
		this.app.mandalaTicker.add((delta) => {
			const currentTime = get(globalTime);
			if (currentTime < startTime) return;
			if (currentTime > startTime + duration) return;
			tickerFunc.call(this, delta);
		});

	}

	/**
	 * Convert the layer to a JSON object.
	 * @returns {MandalaLayerJSON} JSON representation of the layer.
	 */
	// toJSON() {
	// }

	/**
	 * Create a layer from a JSON object.
	 * @param {MandalaLayerJSON} json - JSON representation of the layer.
	 * @returns {MandalaLayer} The layer created from the JSON object.
	 */
	static fromJSON(json: MandalaLayerJSON, app: Mandala) {
		const layer = new MandalaLayer(json.name, app);

		if (json.layerType === 'pattern' && json.pattern) {
			layer.buildPattern(
				() => objectFromJSON(json.pattern!.itemGenerator),
				json.pattern.itemCount,
				json.pattern.radius,
				json.pattern.offset
			);
		}

		if (json.layerType === 'container' && json.children) {
			for (const child of json.children) {
				layer.addChild(objectFromJSON(child));
			}
		}
		
		return layer;
	}
}