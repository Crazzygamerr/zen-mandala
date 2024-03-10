import * as PIXI from 'pixi.js';
import MandalaLayer from './mandalaLayer';
import type { MandalaLayerJSON } from './mandalaLayer';
import { globalTime } from '../store/timeStore';

// type description for the json object
export type MandalaJSON = {
	type: 'mandala';
	appOptions: Partial<PIXI.IApplicationOptions>;
	layers: MandalaLayerJSON[];
};

export default class Mandala extends PIXI.Application {
	layers: MandalaLayer[];
	readonly grid: PIXI.Graphics = new PIXI.Graphics();
	gridVisible: boolean = false;
	animationStarted: boolean = false;
	mandalaTicker: PIXI.Ticker = new PIXI.Ticker();

	/**
	 * Create a Mandala object.
	 * @param {PIXI.IApplicationOptions} args - Arguments for the PIXI Application object
	 */
	constructor(args: Partial<PIXI.IApplicationOptions> = {}) {
		super(args);
		this.layers = [];
		this.drawGrid();
		this.stage.x = this.screen.width / 2;
		this.stage.y = this.screen.height / 2;
		this.stage.scale.y = -1;

		this.mandalaTicker.autoStart = false;
		this.mandalaTicker.add((delta) => {
			if (this.animationStarted) globalTime.update(time => time + delta);
		})
		this.mandalaTicker.update();
	}

	/**
	 * Draw grid lines on the mandala.]
	 */
	drawGrid() {
		this.grid.lineStyle(1, 0x000000, 0.1);
		for (let i = 0; i < this.screen.width / 2 || i < this.screen.height / 2; i += 10) {
			if (i % 100 === 0) {
				this.grid.lineStyle(1, 0x000000, 0.3);
			} else {
				this.grid.lineStyle(1, 0x000000, 0.1);
			}
			if (i < this.screen.width / 2) {
				this.grid.moveTo(i, -this.screen.height / 2);
				this.grid.lineTo(i, this.screen.height / 2);
				this.grid.moveTo(-i, -this.screen.height / 2);
				this.grid.lineTo(-i, this.screen.height / 2);
			}
			if (i < this.screen.height / 2) {
				this.grid.moveTo(-this.screen.width / 2, i);
				this.grid.lineTo(this.screen.width / 2, i);
				this.grid.moveTo(-this.screen.width / 2, -i);
				this.grid.lineTo(this.screen.width / 2, -i);
			}
		}
	}

	/**
	 * Toggle the visibility of the grid.
	 */
	toggleGrid() {
		this.gridVisible = !this.gridVisible;
		if (this.gridVisible) {
			this.stage.addChild(this.grid);
		} else {
			this.stage.removeChild(this.grid);
		}
	}

	/**
	 * Toggle the animation of the mandala.
	 */
	toggleAnimation() {
		this.animationStarted = !this.animationStarted;
		if (this.animationStarted) {
			this.mandalaTicker.start();
		} else {
			this.mandalaTicker.stop();
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
	addLayer(name: string): MandalaLayer {
		if (this.getLayer(name)) {
			throw new Error(`Layer with name ${name} already exists`);
		}
		const layer = new MandalaLayer(name, this);
		this.stage.addChild(layer);
		this.layers.push(layer);
		this.mandalaTicker.update();
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
	 * Highlight a layer
	 * @param {string} name - Name of the layer
	 */
	highlightLayer(name: string) {
		this.layers.forEach(layer => {
			if (layer.name === name) {
				layer.alpha = 1;
			} else {
				layer.alpha = 0.5;
			}
		});
	}
	
	/**
	 * Unhighlight all layers
	 */
	unhighlightLayer() {
		this.layers.forEach(layer => {
			layer.alpha = 1;
		});
	}

	/**
	 * Convert the mandala to a JSON object.
	 * @returns {Object} JSON representation of the mandala.
	 */
	// toJSON() {
	// 	return {
	// 		layers: this.layers.map(layer => layer.toJSON())
	// 	};
	// }
	
	/**
	 * Create a Mandala object from a JSON object.
	 * @param {MandalaJSON} json - JSON representation of the mandala.
	 */
	static fromJSON(json: MandalaJSON) {
		const mandala = new Mandala(json.appOptions);
		
		json.layers.forEach(layerJSON => {
			const layer = MandalaLayer.fromJSON(layerJSON, mandala);
			mandala.stage.addChild(layer);
			mandala.layers.push(layer);
		});
		
		return mandala;
	}
}