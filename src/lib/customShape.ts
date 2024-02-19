import * as PIXI from 'pixi.js';
import Shape from './shape';

// type for the options of the lotus
interface LotusOptions {
	small?: boolean;
	fillColor?: PIXI.ColorSource;
	lineColor?: PIXI.ColorSource;
	secondaryColor?: PIXI.ColorSource;
	scale?: PIXI.IPointData;
}

interface SpiralTriangleOptions {
	scale?: PIXI.IPointData;
	fillColor?: PIXI.ColorSource;
	lineColor?: PIXI.ColorSource;
}
export default class CustomShape extends PIXI.Container {
	constructor() {
		super();

	}

	/**
	 * Draw a styllized lotus
	 * @param {LotusOptions} options - Options for the lotus.
	 * @param {boolean} [options.small=false] - Whether the lotus is small or not.
	 * @param {PIXI.ColorSource} [options.fillColor=0xffffff] - The fill color of the lotus.
	 * @param {PIXI.ColorSource} [options.lineColor=0xffffff] - The line color of the lotus.
	 * @param {PIXI.ColorSource} [options.secondaryColor=0x000000] - The secondary color of the lotus.
	 * @param {PIXI.IPointData} [options.scale={ x: 1, y: 1 }] - The scale of the lotus.
	 */
	draw_lotus({
			small = false,
			fillColor = 0xffffff,
			lineColor = 0xffffff,
			secondaryColor = 0x000000,
			scale = { x: 1, y: 1 }
		}: LotusOptions) {
		const petals: PIXI.DisplayObject[] = [];
		const angles: number[] = [-Math.PI * 3 / 8, -Math.PI / 4, - Math.PI / 8, 0, Math.PI / 8, Math.PI / 4, Math.PI * 3 / 8];
		const sizes: number[] = [17.5, 15, 17.5, 30, 17.5, 15, 17.5];
		const cpx1s: number[] = [3, 2, 2.5, 6, 2.5, 2, 3];
		const cpx2s: number[] = [5, 5, 5, 5, 5, 5, 5];
		
		for (let i = 0; i < angles.length; i++) {
			if (small && (i == 0 || i == 6)) continue;
			const petal = new Shape();
			petal.lineStyle(1, lineColor);
			petal.beginFill(fillColor);
			petal.draw_simple_petal({ height: sizes[i], baseSeparation: 0, cpx1: cpx1s[i], cpx2: cpx2s[i] })
			petal.x = 16 * Math.cos(angles[i]);
			petal.y = 16 * Math.sin(angles[i]);
			petal.rotation = - Math.PI / 2 + angles[i];
			this.addChild(petal);
			petals.push(petal);
		}
		if (small) {
			petals[0].rotation = - Math.PI*3/4;
			petals[petals.length - 1].rotation = - Math.PI/4;
		} else {
			petals[0].rotation = - Math.PI;
			petals[petals.length - 1].rotation = 0;
		}
		
		const startAngle = small ? -Math.PI / 3 : -Math.PI / 2;
		const endAngle = small ? Math.PI / 3 : Math.PI / 2;
		
		const center3 = new Shape();
		center3.lineStyle(1, lineColor);
		center3.beginFill(fillColor);
		center3.arc(0, 0, 15, startAngle, endAngle);
		this.addChild(center3);

		const center2 = new Shape();
		center2.lineStyle(1, secondaryColor);
		center2.beginFill(secondaryColor);
		center2.arc(0, 0, 12, startAngle, endAngle);
		this.addChild(center2);

		const center1 = new Shape();
		center1.lineStyle(1, lineColor);
		center1.beginFill(fillColor);
		center1.moveTo(0, 0);
		center1.lineTo(10 * Math.cos(startAngle), 10 * Math.sin(startAngle));
		center1.arc(0, 0, 10, startAngle, endAngle);
		center1.lineTo(0, 0);
		this.addChild(center1);

		this.scale.copyFrom(scale ? scale : { x: 1, y: 1 });
		return this;
	}

	/**
	 * Draw a triangle with a spiral inside
	 * @param {number} scale - Scale of the triangle.
	 */
	draw_spiral_triangle({
		scale = { x: 1, y: 1 },
		fillColor = 0xffffff,
		lineColor = 0x000000
	}: SpiralTriangleOptions) {
		const innerRadius = 327, outerRadius = 405;
		const number = 15;
		const length = Math.sqrt(outerRadius * outerRadius + innerRadius * innerRadius - 2 * outerRadius * innerRadius * Math.cos(Math.PI / number));
		const angle = Math.asin(Math.sin(Math.PI / number) * innerRadius / length) + Math.PI / number;

		const triangle = new Shape();
		triangle.lineStyle(1, lineColor);
		triangle.beginFill(fillColor);
		triangle.moveTo(0, 0);
		triangle.lineTo(length * Math.cos(angle), length * Math.sin(angle));
		triangle.moveTo(0, 0);
		triangle.lineTo(length * Math.cos(-angle), length * Math.sin(-angle));
		triangle.endFill();
		this.addChild(triangle);

		const centroidX = (length * Math.cos(angle) + length * Math.cos(-angle)) / 3,
			centroidY = (length * Math.sin(angle) + length * Math.sin(-angle)) / 3;

		const spiral1bg = new PIXI.Graphics();
		spiral1bg.lineStyle(3, lineColor);
		spiral1bg.beginFill(fillColor);
		spiral1bg.moveTo(centroidX - 5, centroidY - 5);
		spiral1bg.quadraticCurveTo(centroidX + 30, centroidY - 20, length * Math.cos(angle), length * Math.sin(angle));
		spiral1bg.lineTo(0, 0);
		spiral1bg.endFill();
		this.addChild(spiral1bg);

		const spiral2bg = new PIXI.Graphics();
		spiral2bg.lineStyle(3, lineColor);
		spiral2bg.beginFill(fillColor);
		spiral2bg.moveTo(centroidX - 5, centroidY + 5);
		spiral2bg.quadraticCurveTo(centroidX - 30, centroidY - 20, length * Math.cos(-angle), length * Math.sin(-angle));
		spiral2bg.lineTo(0, 0);
		spiral2bg.quadraticCurveTo(centroidX - 30, centroidY + 20, centroidX + 5, centroidY + 5);
		spiral2bg.endFill();
		this.addChild(spiral2bg);

		const spiral3Mask = new PIXI.Graphics();
		spiral3Mask.lineStyle(3, lineColor);
		spiral3Mask.beginFill(fillColor);
		spiral3Mask.moveTo(centroidX - 5, centroidY + 5);
		spiral3Mask.quadraticCurveTo(centroidX - 30, centroidY - 20, length * Math.cos(-angle), length * Math.sin(-angle));
		spiral3Mask.arc(-327, 0, 405, -Math.PI / 15, Math.PI / 15);
		spiral3Mask.quadraticCurveTo(centroidX + 30, centroidY - 20, centroidX - 5, centroidY - 5);
		spiral3Mask.endFill();
		this.addChild(spiral3Mask);


		const center = new Shape();
		center.lineStyle(8, lineColor);
		center.drawCircle(centroidX, centroidY, 4);
		center.endFill();
		this.addChild(center);

		const innerCurve1 = new Shape();
		innerCurve1.lineStyle(1, lineColor);
		innerCurve1.moveTo(16, 20);
		innerCurve1.quadraticCurveTo(51, 31, 64, 6);
		innerCurve1.moveTo(26, 33);
		innerCurve1.quadraticCurveTo(56, 37, 68, 20);
		innerCurve1.moveTo(38, 47);
		innerCurve1.quadraticCurveTo(58, 49, 69, 36);
		innerCurve1.moveTo(48, 58);
		innerCurve1.quadraticCurveTo(60, 61, 70, 49);
		this.addChild(innerCurve1);

		const spiral1 = new PIXI.Graphics();
		spiral1.lineStyle(3, lineColor);
		spiral1.moveTo(centroidX - 5, centroidY - 5);
		spiral1.quadraticCurveTo(centroidX + 30, centroidY - 20, length * Math.cos(angle), length * Math.sin(angle));
		spiral1.endFill();
		this.addChild(spiral1);

		const innerCurve2 = new Shape();
		innerCurve2.lineStyle(1, lineColor);
		innerCurve2.moveTo(-12, 21);
		innerCurve2.quadraticCurveTo(7, 5, 21, 17);
		innerCurve2.moveTo(-12, 32);
		innerCurve2.quadraticCurveTo(11, 16, 34, 28);
		innerCurve2.rotation = - Math.PI / 2;
		this.addChild(innerCurve2);

		const spiral2 = new Shape();
		spiral2.lineStyle(3, lineColor);
		spiral2.moveTo(centroidX - 5, centroidY + 5);
		spiral2.quadraticCurveTo(centroidX - 30, centroidY - 20, length * Math.cos(-angle), length * Math.sin(-angle));
		spiral2.endFill();
		this.addChild(spiral2);

		const innerCurve3 = new Shape();
		innerCurve3.lineStyle(1, lineColor);
		innerCurve3.moveTo(76, -25);
		innerCurve3.quadraticCurveTo(55, -46, 36, -28);
		innerCurve3.moveTo(33, -12);
		innerCurve3.quadraticCurveTo(63, -33, 77, 0);
		innerCurve3.moveTo(76, -44);
		innerCurve3.quadraticCurveTo(58, -57, 44, -47);
		innerCurve3.moveTo(74, -59);
		innerCurve3.quadraticCurveTo(62, -68, 51, -59);
		this.addChild(innerCurve3);


		const spiral3 = new Shape();
		spiral3.lineStyle(3, lineColor);
		spiral3.moveTo(centroidX + 5, centroidY + 5);
		spiral3.quadraticCurveTo(centroidX - 30, centroidY + 20, 0, 0);
		spiral3.endFill();
		this.addChild(spiral3);

		this.scale.copyFrom(scale ? scale : { x: 1, y: 1 });
		return this;
	}

}