<script lang="ts">
	import CustomShape from '$lib/customShape';
	import Mandala from '$lib/mandala';
	import Shape from '$lib/shape';
	import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth';
	import { ColorGradientFilter, GlowFilter } from 'pixi-filters';
	import * as PIXI from 'pixi.js';
	import { writable } from 'svelte/store';
	// // import GIF from "gif.js";

	const mandalaApp = new Mandala({
		antialias: true,
		background: '#ffffff',
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

	const lineColor = 0xffffff;
	const backgroundColor = 0xffffff;

	// Draw circles for the control points of a curve
	function showControlPoints(g: Graphics, points: number[], radius: number) {
		for (let i = 0; i < points.length; i += 2) {
			g.drawCircle(points[i], points[i + 1], radius);
		}
	}

	const pos = writable([1, 1]);

	mandalaApp.addLayer('solid_circle5').circleConstructor(73, 0x000000, 310);

	// add a large rectangle to mask the outer lotus
	const rectangle = new PIXI.Graphics();
	rectangle.beginFill(0x000000);
	rectangle.drawRect(-352, -352, 704, 352);
	mandalaApp.addLayer('rectangle_mask').addChild(rectangle);

	const spiral_triangle2 = mandalaApp
		.addLayer('spiral_triangle2')
		.buildPattern(
			(i) => new CustomShape().draw_spiral_triangle({ x: 0.9, y: 0.89 }),
			15,
			279,
			Math.PI / 15
		);
	spiral_triangle2.mask = rectangle;
	spiral_triangle2.addAnimation((delta, obj) => (obj.rotation += 0.0025 * delta));

	const outer_lotus = mandalaApp
		.addLayer('outer_lotus')
		.buildPattern((i) => new CustomShape().draw_lotus({ x: 1.35, y: 1.35 }), 15, 276);
	outer_lotus.mask = rectangle;
	outer_lotus.addAnimation((delta, obj) => (obj.rotation += 0.0025 * delta));

	const rectangle2 = new PIXI.Graphics();
	rectangle2.beginFill(0x000000);
	rectangle2.drawRect(-352, 0, 704, 352);
	mandalaApp.addLayer('rectangle_mask2').addChild(rectangle2);

	const spiral_triangle3 = mandalaApp
		.addLayer('spiral_triangle3')
		.buildPattern(
			(i) => new CustomShape().draw_spiral_triangle({ x: 0.9, y: 0.89 }),
			15,
			279,
			Math.PI / 15
		);
	spiral_triangle3.mask = rectangle2;
	spiral_triangle3.addAnimation((delta, obj) => (obj.rotation -= 0.0025 * delta));

	const outer_lotus2 = mandalaApp
		.addLayer('outer_lotus2')
		.buildPattern((i) => new CustomShape().draw_lotus({ x: 1.35, y: 1.35 }), 15, 276);
	outer_lotus2.mask = rectangle2;
	outer_lotus2.addAnimation((delta, obj) => (obj.rotation -= 0.0025 * delta));

	function updateValue() {
		// mandalaApp.getLayer('spiral_triangle2')?.clear();
		// mandalaApp.getLayer('spiral_triangle2')?.buildPattern((i) => new CustomShape().draw_spiral_triangle({x: $pos[0], y:$pos[1]}), 15, 277, Math.PI / 15);
		// mandalaApp.getLayer('outer_lotus')?.clear();
		// mandalaApp.getLayer('outer_lotus')?.buildPattern((i) => new CustomShape().draw_lotus({ x: $pos[2], y: $pos[3] }), 15, 277);
		mandalaApp.getLayer('wide_petal_inner_fill')?.children.forEach((child) => {
			child.skew.set($pos[0], $pos[0]);
		});
		mandalaApp.getLayer('wide_petal_inner')?.children.forEach((child) => {
			child.skew.set($pos[0], $pos[0]);
		});
	}

	// mandalaApp.addLayer('solid_circle3').circleConstructor(2, 0x000000, 277);

	mandalaApp.addLayer('wide_petal').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.lineStyle(4, 0x000000);
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
	mandalaApp.getLayer('wide_petal')?.addAnimation((delta, obj) => (obj.rotation += 0.0025 * delta));

	mandalaApp.addLayer('wide_petal2').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.lineStyle(4, 0x000000);
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
	mandalaApp
		.getLayer('wide_petal2')
		?.addAnimation((delta, obj) => (obj.rotation -= 0.0025 * delta));

	mandalaApp.addLayer('solid_circle2').circleConstructor(90, 0x000000, 140);

	const filter = new ColorGradientFilter();

	const spiral_triangle1 = mandalaApp
		.addLayer('spiral_triangle1')
		.buildPattern(
			(i) => new CustomShape().draw_spiral_triangle({ x: 0.4, y: 0.35 }),
			20,
			155,
			Math.PI / 20
		);

	// add a small lotus layer
	const small_lotus = mandalaApp
		.addLayer('small_lotus')
		.buildPattern((i) => new CustomShape().draw_lotus({ x: 0.6, y: 0.6 }, true), 20, 150);

	mandalaApp.addLayer('inverted_thorn').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.beginFill(0xffffff);
			shape.draw_inverted_thorn(40, 40, 0, 15, 10);
			return shape;
		},
		20,
		105,
		Math.PI / 20
	);

	mandalaApp.addLayer('inverted_thorn_inner').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.beginFill(0x000000);
			shape.draw_inverted_thorn(25, 25, 2.5, 15, 5);
			return shape;
		},
		20,
		120,
		Math.PI / 20
	);

	mandalaApp.addLayer('simple_petal').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.beginFill(0xffffff);
			shape.draw_simple_petal({ height: 40, baseSeparation: 20, cpx1: 40 / 3, cpy1: 15 });
			return shape;
		},
		20,
		95
	);

	mandalaApp.addLayer('half_pill').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.beginFill(0xffffff);
			shape.draw_half_pill(13, 8, 5);
			shape.scale.set(1.5, 1.5);
			return shape;
		},
		45,
		80
	);

	mandalaApp.addLayer('inner_black_circle').circleConstructor(50, 0x000000, 55);

	mandalaApp.addLayer('wide_petal_inner_fill').buildPattern(
		(i) => {
			const container = new PIXI.Container();
			const shape = new Shape();
			shape.lineStyle(0, 0x000000);
			shape.beginFill(0xffffff);
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

	mandalaApp.addLayer('wide_petal_inner').buildPattern(
		(i) => {
			const container = new PIXI.Container();
			const shape = new Shape();
			shape.lineStyle(2, 0x000000);
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
			maskGraphics.beginFill(0x000000);
			maskGraphics.drawRect(0, -25, 50, 35);
			maskGraphics.endFill();
			shape.mask = maskGraphics;
			container.addChild(maskGraphics);

			return container;
		},
		20,
		35
	);

	mandalaApp.addLayer('small_circle').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.drawCircle(0, 0, 3);
			return shape;
		},
		20,
		65
	);

	mandalaApp.addLayer('rectangles').buildPattern((i) => new Shape().draw_rectangle(10, 20), 20, 25);

	mandalaApp.addLayer('solid_circle1').circleConstructor(30, 0x000000, 1);

	// const { CanvasCapture } = CanvasCaptureLib;

	// // Initialize and pass in canvas.
	// CanvasCapture.init(canvas, {
	// 	showRecDot: true,
	// 	showAlerts: true,
	// 	showDialogs: true,
	// 	verbose: false,
	// });

	// const GIF_OPTIONS = {
	// 	name: 'demo-gif',
	// 	quality: 1,
	// 	fps: 60,
	// 	onExportProgress: (progress) => console.log(`GIF export progress: ${progress}.`),
	// 	onExportFinish: () => console.log(`Finished GIF export.`),
	// };
	// CanvasCapture.bindKeyToGIFRecord('g', GIF_OPTIONS);

	// function record(canvas, time) {
	//   var recordedChunks = [];
	//   return new Promise(function (res, rej) {
	//       var stream = canvas.captureStream(25 /*fps*/);
	//       var mediaRecorder = new MediaRecorder(stream, {
	//           mimeType: "video/webm; codecs=vp9"
	//       });

	//       //ondataavailable will fire in interval of `time || 4000 ms`
	//       mediaRecorder.start(time || 4000);

	//       mediaRecorder.ondataavailable = function (event) {
	//           recordedChunks.push(event.data);
	//            // after stop `dataavilable` event run one more time
	//           if (mediaRecorder.state === 'recording') {
	//               mediaRecorder.stop();
	//           }

	//       }

	//       mediaRecorder.onstop = function (event) {
	//           var blob = new Blob(recordedChunks, {type: "video/webm" });
	//           var url = URL.createObjectURL(blob);
	//           res(url);
	//       }
	//   })
	// }

	// const recording = record(canvas, 5233)
	// // play it on another video element
	// var video$ = document.createElement('video')
	// document.body.appendChild(video$)
	// recording.then(url => video$.setAttribute('src', url) )

	// // download it
	// var link$ = document.createElement('a')
	// link$.setAttribute('download','recordingVideo')
	// recording.then(url => {
	//  link$.setAttribute('href', url)
	//  link$.click()
	// })
</script>

<button on:click={() => mandalaApp.toggleGrid()}>Toggle Grid</button>
<button on:click={() => mandalaApp.toggleAnimation()}>Toggle Animation</button>
{#each [...Array($pos.length).keys()] as $i}
	<input type="range" min="0" max="1" step="0.01" bind:value={$pos[$i]} on:input={updateValue} />
{/each}
<div use:addApp></div>
