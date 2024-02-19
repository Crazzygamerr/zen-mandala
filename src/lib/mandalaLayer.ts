import * as PIXI from 'pixi.js';
import type Mandala from './mandala';
import { globalTime } from '../store/timeStore';
import { get } from 'svelte/store';

export default class MandalaLayer extends PIXI.Container {
	name: string;
	app: Mandala;

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
	 * Add a solid circle to the layer. A convenience method instead of drawing a circle using the graphics object.
	 * @param {number} lineWidth - The width of the line.
	 * @param {PIXI.ColorSource} color - The color of the line.
	 * @param {number} radius - The radius of the circle.
	 */
	circleConstructor(lineWidth: number, color: PIXI.ColorSource, radius: number) {
		const g = new PIXI.Graphics();
		g.lineStyle(lineWidth, color);
		g.drawCircle(0, 0, radius);
		g.endFill();
		this.addChild(g);

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
	 * Clear all shapes from the layer.
	 */
	clear() {
		this.removeChildren();
	}

	/**
	 * Convert the layer to a JSON object.
	 * @returns {Object} JSON representation of the layer.
	 */
	toJSON() {
		return {
			name: this.name,
			pattern: {

			}
		};
	}

	/**
	 * Create a layer from a JSON object.
	 * @param {Object} json - JSON representation of the layer.
	 * @returns {MandalaLayer} The created layer.
	 */
	// static fromJSON(json) {
	// const layer = new MandalaLayer(json.name);
	// Create shapes from JSON and add them to the layer
	// json.shapes.forEach(shapeData => {
	// 	const shape = new PIXI.Graphics();
	// 	// Deserialize shape properties and draw shape
	// 	layer.addShape(shape);
	// });
	// return layer;
	// }
}