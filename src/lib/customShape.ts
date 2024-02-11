import * as PIXI from 'pixi.js';
import Shape from './shapes';

export default class CustomShape extends PIXI.Container {
	constructor() {
		super();
		
	}
	
	/**
	 * Draw a styllized lotus
	 * @param {number} height - Height of the lotus.
	 * @param {number} width - Width of the lotus.
	 */
	draw_lotus(height: number) {
		const mainPetal = new Shape().draw_simple_petal({ height: height, baseSeparation: 0, cpx1: 10, cpx2: 5 });
		mainPetal.x = 20;
		this.addChild(mainPetal);
		
		const petal1 = new Shape().draw_simple_petal({ height: height / 2, baseSeparation: 0, cpx1: 2.5, cpx2: 5 });
		petal1.x = height / 2;
		petal1.y = height / 4;
		petal1.rotation = - Math.PI / 4;
		this.addChild(petal1);
		
		const center = new Shape().beginFill(0x000000).drawCircle(0, 0, 5);
		this.addChild(center);
		
		return this;
	}
}