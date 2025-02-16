<script lang="ts">
	import CustomShape from '$lib/customShape';
	import Mandala from '$lib/mandala';
	import MandalaLayer from '$lib/mandalaLayer';
	import type { CircleParams } from '$lib/shape';
	import Shape from '$lib/shape';
	import { GlowFilter } from 'pixi-filters';
	import * as PIXI from 'pixi.js';
	import { globalTime } from '../../store/timeStore';
	import { Viewport } from "pixi-viewport";
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

	const animatedMask = mandalaApp.addLayerFromJSON({
		type: 'mandalaLayer',
		name: 'animated_mask',
		layerType: 'container',
		children: [
			{
				type: 'shape',
				shapeType: 'circle',
				params: { lineWidth: 10, radius: 5 } as CircleParams
			}
		]
	});
	animatedMask.addAnimation(
		function (this: MandalaLayer, delta: number) {
			this.scale.set($globalTime / 25, $globalTime / 25);
		}.bind(animatedMask),
		0,
		800
	);

	mandalaApp.addLayerFromJSON({
		type: 'mandalaLayer',
		name: 'solid_circle4',
		layerType: 'container',
		children: [
			{
				type: 'shape',
				shapeType: 'circle',
				lineColor: middleColor,
				params: { lineWidth: 73, radius: 310 } as CircleParams
			}
		]
	});

	const lowerRectangleMask = new MandalaLayer('rectangle_mask', mandalaApp);
	mandalaApp.addLayer(lowerRectangleMask);
	lowerRectangleMask.addChild(
		new PIXI.Graphics().beginFill(0x000000).drawRect(-352, -352, 704, 352)
	);

	const spiral_triangle2 = new MandalaLayer('spiral_triangle2', mandalaApp).buildPattern(
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
	mandalaApp.addLayer(spiral_triangle2);

	const outer_lotus = new MandalaLayer('outer_lotus', mandalaApp).buildPattern(
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
	mandalaApp.addLayer(outer_lotus);

	const upperRectangleMask = new PIXI.Graphics();
	upperRectangleMask.beginFill(0x000000);
	upperRectangleMask.drawRect(-352, 0, 704, 352);
	const rectangle_mask2 = new MandalaLayer('rectangle_mask2', mandalaApp);
	mandalaApp.addLayer(rectangle_mask2);
	rectangle_mask2.addChild(upperRectangleMask);

	const spiral_triangle3 = new MandalaLayer('spiral_triangle3', mandalaApp);
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
	mandalaApp.addLayer(spiral_triangle3);

	const outer_lotus2 = new MandalaLayer('outer_lotus2', mandalaApp);
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
	mandalaApp.addLayer(outer_lotus2);

	// const wide_petal = mandalaApp.addLayer('wide_petal')
	const wide_petal = new MandalaLayer('wide_petal', mandalaApp);
	wide_petal.buildPattern(
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
	mandalaApp.addLayer(wide_petal);

	const wide_petal2 = new MandalaLayer('wide_petal2', mandalaApp);
	wide_petal2.buildPattern(
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
	mandalaApp.addLayer(wide_petal2);

	// declare it like the ones above, using addLayerFromJSON
	const solid_circle2 = mandalaApp.addLayerFromJSON({
		type: 'mandalaLayer',
		name: 'solid_circle3',
		layerType: 'container',
		children: [
			{
				type: 'shape',
				shapeType: 'circle',
				lineColor: insideColor,
				params: { lineWidth: 90, radius: 140 } as CircleParams
			}
		]
	});
	solid_circle2.mask = animatedMask;

	const spiral_triangle1 = new MandalaLayer('spiral_triangle1', mandalaApp);
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
	mandalaApp.addLayer(spiral_triangle1);

	const small_lotus = new MandalaLayer('small_lotus', mandalaApp);
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
	mandalaApp.addLayer(small_lotus);

	const inverted_thorn = new MandalaLayer('inverted_thorn', mandalaApp);
	inverted_thorn.buildPattern(
		(i) => {
			const shape = new Shape();
			shape.lineStyle(2, middleColor);
			shape.beginFill(backgroundColor);
			shape.draw_inverted_thorn({ height: 40, width: 40, cpx: 0, cpy: 15, curvature: 10 });
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
	mandalaApp.addLayer(inverted_thorn);

	const inverted_thorn_inner = new MandalaLayer('inverted_thorn_inner', mandalaApp);
	inverted_thorn_inner.buildPattern(
		(i) => {
			const shape = new Shape();
			shape.lineStyle(1, middleColor);
			shape.beginFill(insideColor);
			shape.draw_inverted_thorn({ height: 25, width: 25, cpx: 0, cpy: 15, curvature: 5 });
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
	mandalaApp.addLayer(inverted_thorn_inner);

	const simple_petal1 = new MandalaLayer('simple_petal1', mandalaApp);
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
	mandalaApp.addLayer(simple_petal1);

	const half_pill = new MandalaLayer('half_pill', mandalaApp);
	half_pill.buildPattern(
		(i) => {
			const shape = new Shape(insideColor);
			shape.beginFill(backgroundColor);
			shape.draw_half_pill({ height: 13, width: 8, curvature: 5 });
			shape.scale.set(1.5, 1.5);
			return shape;
		},
		45,
		80
	);
	half_pill.mask = animatedMask;
	mandalaApp.addLayer(half_pill);

	const inner_circle = mandalaApp.addLayerFromJSON({
		type: 'mandalaLayer',
		name: 'inner_circle',
		layerType: 'container',
		children: [
			{
				type: 'shape',
				shapeType: 'circle',
				lineColor: insideColor,
				params: { lineWidth: 50, radius: 55 } as CircleParams
			}
		]
	});
	inner_circle.mask = animatedMask;

	const wide_petal_inner_fill = new MandalaLayer('wide_petal_inner_fill', mandalaApp);
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
	mandalaApp.addLayer(wide_petal_inner_fill);

	const wide_petal_inner = new MandalaLayer('wide_petal_inner', mandalaApp);
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
	mandalaApp.addLayer(wide_petal_inner);

	const small_circle = mandalaApp.addLayerFromJSON({
		type: 'mandalaLayer',
		name: 'small_circle',
		layerType: 'pattern',
		pattern: {
			itemCount: 20,
			radius: 65,
			itemGenerator: {
				type: 'shape',
				shapeType: 'circle',
				fillColor: insideColor,
				lineColor: insideColor,
				params: { radius: 3 } as CircleParams
			}
		}
	});
	small_circle.mask = animatedMask;

	const rectangles = mandalaApp.addLayerFromJSON({
		type: 'mandalaLayer',
		name: 'rectangles',
		layerType: 'pattern',
		pattern: {
			itemCount: 24,
			radius: 25,
			itemGenerator: {
				type: 'shape',
				shapeType: 'rectangle',
				lineColor: backgroundColor,
				fillColor: insideColor,
				params: { width: 10, height: 17 }
			}
		}
	});
	rectangles.mask = animatedMask;

	const solid_circle1 = mandalaApp.addLayerFromJSON({
		type: 'mandalaLayer',
		name: 'solid_circle1',
		layerType: 'container',
		children: [
			{
				type: 'shape',
				shapeType: 'circle',
				lineColor: insideColor,
				params: { lineWidth: 30, radius: 1 } as CircleParams
			}
		]
	});
	
	// Set a square aspect ratio and resize
	let ratio;
	if (window.innerWidth > window.innerHeight) {
		ratio = window.innerHeight / 750;  
		mandalaApp.stage.scale.set(ratio, ratio)
	} else {
		ratio = window.innerWidth / 750;
		mandalaApp.stage.scale.set(ratio, ratio);
	}
	
</script>

<!-- <button on:click={() => mandalaApp.toggleGrid()}>Toggle Grid</button> -->
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
<!-- <div>
	{#each mandalaApp.layers as layer}
		<button on:click={() => mandalaApp.highlightLayer(layer.name)}>{layer.name}</button>
	{/each}
	<button on:click={() => mandalaApp.unhighlightLayer()}>Clear Highlight</button>
</div> -->
<div use:addApp></div>
