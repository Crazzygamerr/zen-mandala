import * as PIXI from 'pixi.js';
import MandalaLayer from './mandalaLayer';

export default class Mandala extends PIXI.Application {
	layers: MandalaLayer[];
	readonly grid: PIXI.Graphics = new PIXI.Graphics();

	/**
	 * Create a Mandala object.
	 * @param {PIXI.IApplicationOptions} args - Arguments for the PIXI Application object
	 */
	constructor(args: Partial<PIXI.IApplicationOptions> = {}) {
		super(args);
		this.layers = [];
		this.drawGrid();
	}

	/**
	 * Draw grid lines on the mandala.]
	 */
	drawGrid() {
		this.grid.lineStyle(1, 0x000000, 0.1);
		for (let i = 0; i < this.screen.width; i += 10) {
			this.grid.moveTo(i, 0);
			if (i % 100 === 0) {
				this.grid.lineStyle(1, 0x000000, 0.3);
			} else {
				this.grid.lineStyle(1, 0x000000, 0.1);
			}
			this.grid.lineTo(i, this.screen.height);
		}
		for (let i = 0; i < this.screen.height; i += 10) {
			this.grid.moveTo(0, i);
			if (i % 100 === 0) {
				this.grid.lineStyle(1, 0x000000, 0.3);
			} else {
				this.grid.lineStyle(1, 0x000000, 0.1);
			}
			this.grid.lineTo(this.screen.width, i);
		}
	}

	/**
	 * Add grid lines to the mandala.
	 */
	addGrid() {
		if (!this.stage.children.includes(this.grid)) {
			this.stage.addChild(this.grid);
		}
	}

	/**
	 * Remove grid lines from the mandala.
	 */
	removeGrid() {
		if (this.grid) {
			this.stage.removeChild(this.grid);
		}
	}
	
	/**
	 * Get the layer of a specific name.
	 * @param {string} name - Name of the layer
	 * @returns {MandalaLayer}
	 */
	getLayer(name: string) {
		return this.layers.find(layer => layer.name === name);
	}

	/**
	 * Add a layer to the mandala.
	 * @param {string} name - Name of the layer
	 * @returns {MandalaLayer}
	 */
	addLayer(name: string) {
		const layer = new MandalaLayer(name, this);
		this.stage.addChild(layer);
		this.layers.push(layer);
		return layer;
	}

	/**
	 * Insert a layer at a specific index.
	 * @param {string} name - Name of the layer
	 * @returns {MandalaLayer}
	 */
	insertLayer(name: string, index: number) {
		const layer = new MandalaLayer(name, this);
		this.stage.addChild(layer);
		this.layers.splice(index, 0, layer);
		return layer;
	}

	/**
	 * Remove a layer at a specific index.
	 * @param {number} index - Index of the layer to remove
	 */
	removeLayer(index: number) {
		this.stage.removeChild(this.layers[index]);
		this.layers.splice(index, 1);
	}

	/**
	 * Clear all layers.
	 */
	clear() {
		this.stage.removeChildren();
		this.layers = [];
	}

	/**
	 * Convert the mandala to a JSON object.
	 * @returns {Object} JSON representation of the mandala.
	 */
	toJSON() {
		return {
			layers: this.layers.map(layer => layer.toJSON())
		};
	}
}