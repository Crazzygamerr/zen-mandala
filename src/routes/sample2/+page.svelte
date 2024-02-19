<script lang="ts">
	import CustomShape from '$lib/customShape';
	import Mandala from '$lib/mandala';
	import MandalaLayer from '$lib/mandalaLayer';
	import Shape from '$lib/shape';
	import { GlowFilter } from 'pixi-filters';
	import * as PIXI from 'pixi.js';
	import { writable } from 'svelte/store';
	import { globalTime } from '../../store/timeStore';
	// // import GIF from "gif.js";

	let backgroundColor = '80BCBD',
		outsideColor = '685369',
		middleColor = 'C6DCBA',
		insideColor = '35605A';

	const mandalaApp = new Mandala({
		antialias: true,
		background: backgroundColor,
		resizeTo: window
	});

	function addApp(node: HTMLElement) {
		node.appendChild(mandalaApp.view as unknown as Node);
	}

	const glowFilter = new GlowFilter({
		distance: 7,
		outerStrength: 1,
		color: 0xffffff
	});

	const animatedMask = mandalaApp.addLayer('solid_circle_anim').circleConstructor(10, 0x000000, 5);
	animatedMask.addAnimation(
		function (this: MandalaLayer, delta: number) {
			this.scale.set($globalTime / 25, $globalTime / 25);
		}.bind(animatedMask),
		0,
		800
	);

	mandalaApp.addLayer('solid_circle5').circleConstructor(73, middleColor, 310);

	const lowerRectangleMask = mandalaApp.addLayer('rectangle_mask');
	lowerRectangleMask.addChild(
		new PIXI.Graphics().beginFill(0x000000).drawRect(-352, -352, 704, 352)
	);

	const spiral_triangle2 = mandalaApp.addLayer('spiral_triangle2').buildPattern(
		(i) =>
			new CustomShape().draw_spiral_triangle({
				scale: { x: 0.9, y: 0.89 },
				fillColor: insideColor,
				lineColor: middleColor
			}),
		15,
		279,
		Math.PI / 15
	);
	spiral_triangle2.mask = lowerRectangleMask;
	spiral_triangle2.addAnimation(
		function (this: MandalaLayer, delta: number) {
			this.rotation += 0.0025 * delta;
		}.bind(spiral_triangle2)
	);

	const outer_lotus = mandalaApp.addLayer('outer_lotus').buildPattern(
		(i) =>
			new CustomShape().draw_lotus({
				scale: { x: 1.35, y: 1.35 },
				fillColor: outsideColor,
				lineColor: outsideColor,
				secondaryColor: middleColor
			}),
		15,
		276
	);
	outer_lotus.mask = lowerRectangleMask;
	outer_lotus.addAnimation(
		function (this: MandalaLayer, delta: number) {
			this.rotation += 0.0025 * delta;
		}.bind(outer_lotus)
	);

	const upperRectangleMask = new PIXI.Graphics();
	upperRectangleMask.beginFill(0x000000);
	upperRectangleMask.drawRect(-352, 0, 704, 352);
	mandalaApp.addLayer('rectangle_mask2').addChild(upperRectangleMask);

	const spiral_triangle3 = mandalaApp.addLayer('spiral_triangle3');
	spiral_triangle3.buildPattern(
		(i) =>
			new CustomShape().draw_spiral_triangle({
				scale: { x: 0.9, y: 0.89 },
				fillColor: insideColor,
				lineColor: middleColor
			}),
		15,
		279,
		Math.PI / 15
	);
	spiral_triangle3.mask = upperRectangleMask;

	spiral_triangle3.addAnimation(
		function (this: MandalaLayer, delta: number) {
			this.rotation -= 0.0025 * delta;
		}.bind(spiral_triangle3)
	);

	const outer_lotus2 = mandalaApp.addLayer('outer_lotus2');
	outer_lotus2.buildPattern(
		(i) =>
			new CustomShape().draw_lotus({
				scale: { x: 1.35, y: 1.35 },
				fillColor: outsideColor,
				lineColor: outsideColor,
				secondaryColor: middleColor
			}),
		15,
		276
	);
	outer_lotus2.mask = upperRectangleMask;
	outer_lotus2.addAnimation(
		function (this: MandalaLayer, delta: number) {
			this.rotation -= 0.0025 * delta;
		}.bind(outer_lotus2)
	);

	// mandalaApp.addLayer('solid_circle3').circleConstructor(2, 0x000000, 277);

	const wide_petal = mandalaApp.addLayer('wide_petal').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.lineStyle(4, outsideColor);
			shape.draw_simple_petal({
				height: 125,
				baseSeparation: 150,
				cpx1: 85,
				cpx2: 45
			});
			shape.scale.set(0.8, 0.8);
			return shape;
		},
		15,
		170,
		Math.PI / 15
	);
	wide_petal.mask = animatedMask;
	wide_petal.addAnimation(
		function (this: MandalaLayer, delta: number) {
			this.rotation += 0.0025 * delta;
		}.bind(wide_petal)
	);

	const wide_petal2 = mandalaApp.addLayer('wide_petal2').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.lineStyle(4, outsideColor);
			shape.draw_simple_petal({
				height: 125,
				baseSeparation: 150,
				cpx1: 85,
				cpx2: 45
			});
			shape.scale.set(0.8, 0.8);
			return shape;
		},
		15,
		170
	);
	wide_petal2.mask = animatedMask;
	wide_petal2.addAnimation(
		function (this: MandalaLayer, delta: number) {
			this.rotation -= 0.0025 * delta;
		}.bind(wide_petal2)
	);

	mandalaApp.addLayer('solid_circle2').circleConstructor(90, insideColor, 140).mask = animatedMask;

	const spiral_triangle1 = mandalaApp.addLayer('spiral_triangle1');
	spiral_triangle1.buildPattern(
		(i) =>
			new CustomShape().draw_spiral_triangle({
				scale: { x: 0.4, y: 0.35 },
				fillColor: outsideColor,
				lineColor: backgroundColor
			}),
		20,
		155,
		Math.PI / 20
	);
	spiral_triangle1.alpha = 0;
	spiral_triangle1.addAnimation(
		function (this: MandalaLayer, delta: number) {
			const duration = 40,
				startTime = 350;
			this.alpha = Math.min(1, Math.max(0, ($globalTime - startTime) / duration));
		}.bind(spiral_triangle1)
	);

	const small_lotus = mandalaApp.addLayer('small_lotus');
	small_lotus.buildPattern(
		(i) =>
			new CustomShape().draw_lotus({
				scale: { x: 0.6, y: 0.6 },
				small: true,
				fillColor: middleColor,
				lineColor: middleColor,
				secondaryColor: insideColor
			}),
		20,
		150
	);
	small_lotus.alpha = 0;
	small_lotus.addAnimation(
		function (this: MandalaLayer, delta: number) {
			const duration = 40,
				startTime = 350;
			this.alpha = Math.min(1, Math.max(0, ($globalTime - startTime) / duration));
		}.bind(small_lotus)
	);

	const inverted_thorn = mandalaApp.addLayer('inverted_thorn');
	inverted_thorn.buildPattern(
		(i) => {
			const shape = new Shape();
			shape.lineStyle(2, middleColor);
			shape.beginFill(backgroundColor);
			shape.draw_inverted_thorn(40, 40, 0, 15, 10);
			return shape;
		},
		20,
		105,
		Math.PI / 20
	);
	inverted_thorn.alpha = 0;
	inverted_thorn.addAnimation(
		function (this: MandalaLayer, delta: number) {
			const duration = 100,
				startTime = 325;
			this.alpha = Math.min(1, Math.max(0, ($globalTime - startTime) / duration));
		}.bind(inverted_thorn)
	);

	const inverted_thorn_inner = mandalaApp.addLayer('inverted_thorn_inner');
	inverted_thorn_inner.buildPattern(
		(i) => {
			const shape = new Shape();
			shape.lineStyle(1, middleColor);
			shape.beginFill(insideColor);
			shape.draw_inverted_thorn(25, 25, 2.5, 15, 5);
			return shape;
		},
		20,
		120,
		Math.PI / 20
	);
	inverted_thorn_inner.alpha = 0;
	inverted_thorn_inner.addAnimation(
		function (this: MandalaLayer, delta: number) {
			const duration = 100,
				startTime = 325;
			this.alpha = Math.min(1, Math.max(0, ($globalTime - startTime) / duration));
		}.bind(inverted_thorn_inner)
	);

	const simple_petal1 = mandalaApp.addLayer('simple_petal');
	simple_petal1.buildPattern(
		(i) => {
			const shape = new Shape(middleColor);
			shape.beginFill(middleColor);
			shape.draw_simple_petal({ height: 40, baseSeparation: 20, cpx1: 40 / 3, cpy1: 15 });
			return shape;
		},
		20,
		95
	);
	simple_petal1.alpha = 0;
	simple_petal1.addAnimation(
		function (this: MandalaLayer, delta: number) {
			const duration = 80,
				startTime = 250;
			this.alpha = Math.min(1, Math.max(0, ($globalTime - startTime) / duration));
		}.bind(simple_petal1)
	);

	mandalaApp.addLayer('half_pill').buildPattern(
		(i) => {
			const shape = new Shape(insideColor);
			shape.beginFill(backgroundColor);
			shape.draw_half_pill(13, 8, 5);
			shape.scale.set(1.5, 1.5);
			return shape;
		},
		45,
		80
	).mask = animatedMask;

	mandalaApp.addLayer('inner_circle').circleConstructor(50, insideColor, 55).mask = animatedMask;

	const wide_petal_inner_fill = mandalaApp.addLayer('wide_petal_inner_fill');
	wide_petal_inner_fill.buildPattern(
		(i) => {
			const container = new PIXI.Container();
			const shape = new Shape();
			shape.lineStyle(0, 0x000000);
			shape.beginFill(middleColor);
			shape.draw_simple_petal({
				height: 100,
				baseSeparation: 45,
				cpx1: 70,
				cpy1: 33,
				cpx2: 25,
				cpy2: 66
			});
			shape.scale.set(0.4, 0.4);
			container.addChild(shape);

			return container;
		},
		20,
		35
	);
	wide_petal_inner_fill.mask = animatedMask;

	const wide_petal_inner = mandalaApp.addLayer('wide_petal_inner');
	wide_petal_inner.buildPattern(
		(i) => {
			const container = new PIXI.Container();
			const shape = new Shape(insideColor);
			shape.lineStyle(3, insideColor);
			shape.beginFill(0xffffff, 0);
			shape.draw_simple_petal({
				height: 100,
				baseSeparation: 45,
				cpx1: 70,
				cpy1: 33,
				cpx2: 25,
				cpy2: 66
			});
			shape.scale.set(0.4, 0.4);
			container.addChild(shape);

			let maskGraphics = new PIXI.Graphics();
			maskGraphics.beginFill(insideColor);
			maskGraphics.drawRect(0, -25, 50, 35);
			maskGraphics.endFill();
			shape.mask = maskGraphics;
			container.addChild(maskGraphics);

			return container;
		},
		20,
		35
	);
	wide_petal_inner.mask = animatedMask;

	const small_circle = mandalaApp.addLayer('small_circle');
	small_circle.buildPattern(
		(i) => new Shape(insideColor).beginFill(insideColor).drawCircle(0, 0, 3),
		20,
		65
	);
	small_circle.mask = animatedMask;

	const rectangles = mandalaApp.addLayer('rectangles');
	rectangles.buildPattern(
		(i) => new Shape(backgroundColor, insideColor).draw_rectangle(10, 17),
		24,
		25
	);
	rectangles.mask = animatedMask;

	mandalaApp.addLayer('solid_circle1').circleConstructor(30, insideColor, 1);
</script>

<button on:click={() => mandalaApp.toggleGrid()}>Toggle Grid</button>
<button on:click={() => mandalaApp.toggleAnimation()}>Toggle Animation</button>
<!-- input for mandalaTimer -->
<div>
	Time ruler (ms):
	<input
		type="number"
		bind:value={$globalTime}
		on:input={() => {
			mandalaApp.mandalaTicker.update();
		}}
	/>
	<input
		type="range"
		min="0"
		max="800"
		step="1"
		style="width: 500px;"
		bind:value={$globalTime}
		on:input={() => {
			mandalaApp.mandalaTicker.update();
		}}
	/>
</div>
<div use:addApp></div>
