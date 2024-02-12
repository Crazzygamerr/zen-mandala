// import * as PIXI from 'pixi.js';
import { SmoothGraphics, DashLineShader } from '@pixi/graphics-smooth';

type SimplePetalParams = {
	height: number,
	baseSeparation: number,
	cpx1?: number,
	cpy1?: number,
	cpx2?: number,
	cpy2?: number,
};

// export default class Shape extends PIXI.Graphics {
// Make this class extend both PIXI.Graphics and PIXI.SmoothGraphics
export default class Shape extends SmoothGraphics {
	constructor() {
		super();
		super.lineStyle(1, 0x000000, 1);
	}

	/**
	 * Draw an arrowhead.
	 * @param {number} h - Height of the arrowhead.
	 * @param {number} w - Width of the arrowhead.
	 */
	arrowhead(h: number, w: number) {
		super.moveTo(0, 0);
		super.lineTo(-w, h);
		super.lineTo(w, h);
		super.lineTo(0, 0);
		return this;
	}

	draw_arc_variant() {
		super.lineStyle(2, 0x000000, 1);
		super.arc(6, 0, 32.5, (2 / 5) * Math.PI, (-2 / 5) * Math.PI, true);
		super.moveTo(10, 22.5);
		super.arc(3.5, 0, 25, (2 / 5) * Math.PI, (-2 / 5) * Math.PI, true);
		super.lineStyle({
			width: 2,
			color: 0x000000,
			shader: new DashLineShader({ dash: 2, gap: 3 })
		});
		super.moveTo(20, 27.5);
		super.arc(7, 0, 35, (2 / 5) * Math.PI, (-2 / 5) * Math.PI, true);
		super.endFill();
		return this;
	}

	draw_leaf_variant() {
		super.lineStyle(2, 0x000000, 1);
		super.moveTo(45, 0);
		super.bezierCurveTo(60, 33, 15, 66, 0, 100);
		super.bezierCurveTo(-15, 66, -60, 33, -45, 0);
		super.moveTo(47.5, 10);
		super.bezierCurveTo(60, 43, 15, 76, 0, 110);
		super.bezierCurveTo(-15, 76, -60, 43, -47.5, 10);
		super.lineStyle({
			width: 3,
			color: 0x000000,
			shader: new DashLineShader({ dash: 3, gap: 6 })
		});
		super.moveTo(30, 20);
		super.bezierCurveTo(40, 33, 10, 55, 0, 80);
		super.bezierCurveTo(-10, 55, -40, 33, -30, 20);
		super.rotation = -Math.PI / 2;
		super.endFill();
		return this;
	}

	draw_leaf() {
		super.lineStyle(2, 0x000000, 1);
		super.moveTo(0, 0);
		super.quadraticCurveTo(54, -50, 0, -95);
		super.quadraticCurveTo(-54, -50, 0, 0);
		super.moveTo(0, 10);
		super.quadraticCurveTo(54, -50, 0, -105);
		super.quadraticCurveTo(-54, -50, 0, 10);
		super.beginFill(0x000000);
		super.drawEllipse(0, -72, 4, 8);
		super.rotation = Math.PI / 2;
		super.endFill();
	}

	draw_half_pill(height: number, width: number, curvature: number) {
		super.moveTo(0, width / 2);
		super.lineTo(height - width / 2, width / 2);
		super.quadraticCurveTo(height + curvature, 0, height - width / 2, -width / 2);
		super.lineTo(0, -width / 2);
		super.endFill();
		return this;
	}

	draw_simple_petal({
		height, baseSeparation,
		cpx1 = baseSeparation, cpy1 = height / 3,
		cpx2 = baseSeparation / 2, cpy2 = height / 2
	}: SimplePetalParams) {
		
		const [x1, y1, x2, y2, x3, y3, x4, y4] = [cpx1, cpy1, cpx2, cpy2, -cpx2, cpy2, -cpx1, cpy1];
		super.moveTo(baseSeparation / 2, 0);
		super.bezierCurveTo(x1, y1, x2, y2, 0, height);
		super.bezierCurveTo(x3, y3, x4, y4, -baseSeparation / 2, 0);

		super.rotation = -Math.PI / 2;
		super.endFill();

		return this;
	}

	draw_bindi(
		height: number = 60,
		cpx1: number = height / 4, cpy1: number = 0,
		cpx2: number = height / 8, cpy2: number = height / 2
	) {
		const cp3 = [cpx1, cpy1, cpx2, cpy2];
		const cp4 = [-cpx2, cpy2, -cpx1, cpy1];
		super.beginFill(0x000000);
		super.moveTo(0, 0);
		super.bezierCurveTo(cp3[0], cp3[1], cp3[2], cp3[3], 0, height);
		super.bezierCurveTo(cp4[0], cp4[1], cp4[2], cp4[3], 0, 0);

		super.rotation = -Math.PI / 2;
		super.endFill();
		return this;
	}

	/**
	 * Draw a bindi with quadratic curves.
	 * @param {number} height - Height of the bindi.
	 * @param {number} width - Width of the bindi.
	 * 

	draw_rotated_petal() {
		super.lineStyle(4, 0x000000, 1);
		const [x1, y1, x2, y2, x3, y3, x4, y4] = [40, 33, 25, 66, -25, 66, -40, 33];
		super.moveTo(35, 0);
		super.bezierCurveTo(x1, y1, x2, y2, 0, 100);
		super.bezierCurveTo(x3, y3, x4, y4, -35, 0);
		super.endFill();
		return this;
	}

	/**
	 * Draw a rectangle.
	 * @param {number} width - Width of the rectangle.
	 * @param {number} height - Height of the rectangle.
	 */
	draw_rectangle(width: number, height: number) {
		super.lineStyle(1, 0x000000, 1);
		super.beginFill(0xffffff);
		super.drawRect(-width / 2, -height / 2, width, height);
		super.rotation = -Math.PI / 2;
		super.endFill();
		return this;
	}

	/**
	 * Draw an inverted thorn.
	 * @param {number} width - Width of the thorn.
	 * @param {number} height - Height of the thorn.
	 */
	draw_inverted_thorn(
		height: number, width: number,
		cpx: number = 0, cpy: number = height * 3 / 4,
		curvature: number = 0
	) {
		super.lineStyle(1, 0x000000, 1);
		super.moveTo(0, 0);
		super.quadraticCurveTo(cpx, cpy, width / 2, height);
		super.quadraticCurveTo(0, height * 5 / 4 + curvature, -width / 2, height);
		super.quadraticCurveTo(-cpx, cpy, 0, 0);
		super.rotation = -Math.PI / 2;
		super.endFill();
		return this;
	}

}
