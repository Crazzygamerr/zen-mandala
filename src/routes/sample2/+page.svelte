<script lang="ts">
	import Mandala from '$lib/mandala';
	import Shape from '$lib/shapes';
	import CustomShape from '$lib/customShape';
	import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth';
	import { GlowFilter } from 'pixi-filters';
	import * as PIXI from 'pixi.js';
	// // import GIF from "gif.js";

	const mandalaApp = new Mandala({
		antialias: true,
		background: '#ffffff',
		resizeTo: window
	});
	mandalaApp.addGrid();

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

	

	mandalaApp.addLayer('solid_circle').circleConstructor(120, 0x000000, 155);

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

	mandalaApp.addLayer('inner_black_circle').circleConstructor(42.5, 0x000000, 60);

	mandalaApp.addLayer('wide_petal').buildPattern(
		(i) => {
			const shape = new Shape();
			shape.beginFill(0xffffff);
			shape.draw_wide_petal();
			shape.scale.set(0.4, 0.4);
			return shape;
		},
		8,
		35
	);
	// add a layer of rectangles for masking the petals
	// mandalaApp
	// 	.addLayer('rectangle mask')
	// 	.buildPattern(
	// 		(i) =>{
	// 			 const shape = new Shape();
	// 			 shape.moveTo(-20, -20);
	// 			 shape.lineStyle(1, 0x000000);
	// 			 shape.beginFill(0x000000);
	// 			 shape.drawRect(0, 0, 30, 30);
	// 			 return shape
	// 			},
	// 		8, 35,
	// 		Math.PI / 32
	// 	);
	// mandalaApp.layers[0].mask = mandalaApp.layers[1];

	mandalaApp.addLayer('rectangles').buildPattern((i) => new Shape().draw_rectangle(10, 20), 20, 25);

	mandalaApp.addLayer('solid_circle').circleConstructor(30, 0x000000, 1);

	const test = new CustomShape().draw_lotus(35);
	test.x = 100;
	test.y = 200;
	mandalaApp.stage.addChild(test);

	const g = new Shape().draw_simple_petal({height: 100, baseSeparation: 35});
	g.y = 100;
	let maskGraphics = new PIXI.Graphics();
	maskGraphics.beginFill(0x000000);
	maskGraphics.drawRect(0, 0, 100, 100);
	maskGraphics.endFill();
	mandalaApp.stage.addChild(maskGraphics);
	// g.mask = maskGraphics;
	mandalaApp.stage.addChild(g);

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

<button>aa</button>
<div use:addApp></div>
