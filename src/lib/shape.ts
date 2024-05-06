import { DashLineShader, SmoothGraphics } from '@pixi/graphics-smooth';
import * as PIXI from 'pixi.js';

// export type params for all the shapes
export type ArrowheadParams = {
	h: number,
	w: number,
};

export type HalfPillParams = {
	height: number,
	width: number,
	curvature?: number,
};

export type SimplePetalParams = {
	height: number,
	baseSeparation: number,
	cpx1?: number,
	cpy1?: number,
	cpx2?: number,
	cpy2?: number,
};

export type BindiParams = {
	height: number,
	cpx1: number,
	cpy1: number,
	cpx2: number,
	cpy2: number,
};

export type InvertedThornParams = {
	height: number,
	width: number,
	cpx: number,
	cpy: number,
	curvature: number,
};

export type RectangleParams = {
	height: number,
	width: number,
};

export type CircleParams = {
	lineWidth?: number,
	radius: number,
};

export type TriangleParams = {
	base: number,
	height: number,
};

export type shapeType = 'arrowhead' | 'arc_variant' | 'leaf_variant' | 'leaf' | 'half_pill' | 'simple_petal' | 'bindi' | 'inverted_thorn' | 'rectangle' | 'circle' | 'triangle' | 'none';
export type shapeParams = ArrowheadParams | HalfPillParams | BindiParams | InvertedThornParams | RectangleParams | SimplePetalParams | CircleParams | TriangleParams;

export type ShapeJSON = {
	type: 'shape';
	lineColor?: PIXI.ColorSource;
	fillColor?: PIXI.ColorSource;
	shapeType: shapeType;
	params?: shapeParams;
};

export default class Shape extends SmoothGraphics {
	lineColor: PIXI.ColorSource;
	fillColor?: PIXI.ColorSource;
	shapeType: shapeType = 'none';
	params?: shapeParams;

	constructor(lineColor: PIXI.ColorSource = 0x000000, fillColor?: PIXI.ColorSource) {
		super();
		super.lineStyle(1, lineColor, 1);
		this.lineColor = lineColor;
		this.fillColor = fillColor;
	}

	/**
	 * Draw an arrowhead.
	 * @param {number} h - Height of the arrowhead.
	 * @param {number} w - Width of the arrowhead.
	 */
	draw_arrowhead({ h, w }: ArrowheadParams) {
		this.shapeType = 'arrowhead';
		this.params = { h, w };
		if (this.fillColor) super.beginFill(this.fillColor);

		super.moveTo(0, 0);
		super.lineTo(-w, h);
		super.lineTo(w, h);
		super.lineTo(0, 0);
		return this;
	}

	draw_arc_variant() {
		this.shapeType = 'arc_variant'

		super.lineStyle(2, this.lineColor, 1);
		super.arc(6, 0, 32.5, (2 / 5) * Math.PI, (-2 / 5) * Math.PI, true);
		super.moveTo(10, 22.5);
		super.arc(3.5, 0, 25, (2 / 5) * Math.PI, (-2 / 5) * Math.PI, true);
		super.lineStyle({
			width: 2,
			color: this.lineColor,
			shader: new DashLineShader({ dash: 2, gap: 3 })
		});
		super.moveTo(20, 27.5);
		super.arc(7, 0, 35, (2 / 5) * Math.PI, (-2 / 5) * Math.PI, true);
		super.endFill();
		return this;
	}

	draw_leaf_variant() {
		this.shapeType = 'leaf_variant';

		super.lineStyle(2, this.lineColor, 1);
		super.moveTo(45, 0);
		super.bezierCurveTo(60, 33, 15, 66, 0, 100);
		super.bezierCurveTo(-15, 66, -60, 33, -45, 0);
		super.moveTo(47.5, 10);
		super.bezierCurveTo(60, 43, 15, 76, 0, 110);
		super.bezierCurveTo(-15, 76, -60, 43, -47.5, 10);
		super.lineStyle({
			width: 3,
			color: this.lineColor,
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
		this.shapeType = 'leaf';

		super.lineStyle(2, this.lineColor, 1);
		super.moveTo(0, 0);
		super.quadraticCurveTo(54, -50, 0, -95);
		super.quadraticCurveTo(-54, -50, 0, 0);
		super.moveTo(0, 10);
		super.quadraticCurveTo(54, -50, 0, -105);
		super.quadraticCurveTo(-54, -50, 0, 10);
		super.beginFill(this.fillColor);
		super.drawEllipse(0, -72, 4, 8);
		super.rotation = Math.PI / 2;
		super.endFill();
	}

	draw_half_pill({ height, width, curvature = 0 }: HalfPillParams) {
		this.shapeType = 'half_pill';
		this.params = { height, width, curvature };
		if (this.fillColor) super.beginFill(this.fillColor);

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
		this.shapeType = 'simple_petal';
		this.params = { height, baseSeparation, cpx1, cpy1, cpx2, cpy2 };
		if (this.fillColor) super.beginFill(this.fillColor);

		const [x1, y1, x2, y2, x3, y3, x4, y4] = [cpx1, cpy1, cpx2, cpy2, -cpx2, cpy2, -cpx1, cpy1];
		super.moveTo(baseSeparation / 2, 0);
		super.bezierCurveTo(x1, y1, x2, y2, 0, height);
		super.bezierCurveTo(x3, y3, x4, y4, -baseSeparation / 2, 0);

		super.rotation = -Math.PI / 2;
		super.endFill();
		return this;
	}

	draw_bindi({
		height = 60,
		cpx1 = height / 4, cpy1 = 0,
		cpx2 = height / 8, cpy2 = height / 2
	}: BindiParams) {
		this.shapeType = 'bindi';
		this.params = { height, cpx1, cpy1, cpx2, cpy2 };
		if (this.fillColor) super.beginFill(this.fillColor);

		const cp3 = [cpx1, cpy1, cpx2, cpy2];
		const cp4 = [-cpx2, cpy2, -cpx1, cpy1];
		super.moveTo(0, 0);
		super.bezierCurveTo(cp3[0], cp3[1], cp3[2], cp3[3], 0, height);
		super.bezierCurveTo(cp4[0], cp4[1], cp4[2], cp4[3], 0, 0);

		super.rotation = -Math.PI / 2;
		super.endFill();
		return this;
	}

	/**
	 * Draw a rectangle.
	 * @param {number} width - Width of the rectangle.
	 * @param {number} height - Height of the rectangle.
	 */
	draw_rectangle({ height, width }: RectangleParams) {
		this.shapeType = 'rectangle';
		this.params = { height, width };
		if (this.fillColor) super.beginFill(this.fillColor);

		super.drawRect(-width / 2, -height / 2, width, height);
		super.rotation = -Math.PI / 2;
		super.endFill();
		return this;
	}

	/**
	 * Draw a circle.
	 * @param {number} lineWidth - The width of the line.
	 * @param {number} radius - The radius of the circle.
	 */
	draw_circle({ lineWidth = 1, radius }: CircleParams) {
		this.shapeType = 'circle';
		this.params = { lineWidth, radius };
		if (this.fillColor) { super.beginFill(this.fillColor); }

		this.lineStyle(lineWidth, this.lineColor);
		this.drawCircle(0, 0, radius);
		this.endFill();
		return this;
	}

	/**
	 * Draw a triangle.
	 * @param {number} base - Base of the triangle.
	 * @param {number} height - Height of the triangle.
	 */
	draw_triangle({ base, height }: TriangleParams) {
		this.shapeType = 'triangle';
		this.params = { base, height };
		if (this.fillColor) super.beginFill(this.fillColor);

		super.moveTo(-base / 2, -height / 2);
		super.lineTo(base / 2, -height / 2);
		super.lineTo(0, height / 2);
		super.lineTo(-base / 2, -height / 2);
		super.rotation = -Math.PI / 2;
		super.endFill();
		return this;
	}
	
	/**
	 * Draw an inverted thorn.
	 * @param {number} width - Width of the thorn.
	 * @param {number} height - Height of the thorn.
	 */
	draw_inverted_thorn({
		height, width,
		cpx = 0, cpy = height * 3 / 4,
		curvature = 0
	}: InvertedThornParams) {
		this.shapeType = 'inverted_thorn';
		this.params = { height, width, cpx, cpy, curvature };
		if (this.fillColor) super.beginFill(this.fillColor);

		super.moveTo(0, 0);
		super.quadraticCurveTo(cpx, cpy, width / 2, height);
		super.quadraticCurveTo(0, height * 5 / 4 + curvature, -width / 2, height);
		super.quadraticCurveTo(-cpx, cpy, 0, 0);
		super.rotation = -Math.PI / 2;
		super.endFill();
		return this;
	}

	/**
	 * Convert the shape to a JSON object.
	 * @returns {Object} JSON representation of the shape.
	 */
	toJSON(): ShapeJSON {
		return {
			type: 'shape',
			lineColor: this.lineColor,
			fillColor: this.fillColor,
			shapeType: this.shapeType,
			params: this.params
		};
	}

	/**
	 * Create a Shape object from a JSON object.
	 * @param {ShapeJSON} json - JSON representation of the shape.
	 */
	static fromJSON(json: ShapeJSON) {
		const shape = new Shape(json.lineColor, json.fillColor);
		// check if the params are of the correct type
		
		
		(shape as any)[`draw_${json.shapeType}`](json.params); // eslint-disable-line @typescript-eslint/no-explicit-any
		return shape;
	}
}
