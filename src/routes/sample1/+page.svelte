<script lang='ts'>
	import * as PIXI from 'pixi.js';
	import { GlowFilter } from 'pixi-filters';
	import { SmoothGraphics as Graphics, DashLineShader } from '@pixi/graphics-smooth';
	import Mandala from '$lib/mandala';
	import { Viewport } from "pixi-viewport";
	// // import GIF from "gif.js";

	const app = new PIXI.Application({
		antialias: true,
		background: '#000000',
		resizeTo: window,
	});
	
	const viewport = new Viewport({
		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,
		events: app.renderer.events, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
	});
	
	viewport.drag().pinch().wheel().decelerate();

	app.stage.addChild(viewport);

	function addApp(node: HTMLElement) {
		node.appendChild(app.view as unknown as Node);
	}

	const glowFilter = new GlowFilter({
		distance: 7,
		outerStrength: 1,
		color: 0xaf3dff
	});

	const lineColor = 0x000000;

	// Convenient function to make a layer with only a circle
	function circleConstructor(lineWidth: number, color: number, radius: number) {
		const container = new PIXI.Container();
		let g = new PIXI.Graphics();
		g.lineStyle(lineWidth, color);
		g.drawCircle(0, 0, radius);
		g.endFill();
		container.addChild(g);
		container.x = app.screen.width / 2;
		container.y = app.screen.height / 2;
		container.scale.set(1.5, 1.5);
		viewport.addChild(container);
	}

	// Construct a layer of repeating pattern
	function layerConstructor(itemGenerator: (i: number) => PIXI.Graphics | Graphics, itemCount: number, radius: number, rotationSpeed:number, offset:number = 0) {
		const container = new PIXI.Container();

		for (let i = 0; i < itemCount; i++) {
			let g1 = itemGenerator(i);

			let theta = (2 * 3.14 * i) / itemCount + offset;
			let x = radius * Math.cos(theta);
			let y = radius * Math.sin(theta);

			g1.x = x;
			g1.y = y;
			g1.rotation += theta;
			container.addChild(g1);
		}

		viewport.addChild(container);
		container.x = app.screen.width / 2;
		container.y = app.screen.height / 2;
		app.ticker.add((delta) => {
			container.rotation += rotationSpeed * delta;
		});

		container.scale.set(1.5, 1.5);
		return container;
	}
	
	function draw_arrowhead() {
		let g3 = new PIXI.Graphics();
		g3.lineStyle(1, 0xaf3dff, 1);
		g3.moveTo(0, 0);
		g3.lineTo(10, 5);
		g3.lineTo(0, 10);
		g3.endFill();
		return g3;
	}

	function draw_circle() {
		let g1 = new PIXI.Graphics();
		g1.lineStyle(2, 0xaf3dff, 1);
		g1.drawCircle(0, 0, 10);
		g1.endFill();
		return g1;
	}

	function draw_semicircle() {
		let g2 = new PIXI.Graphics();
		g2.lineStyle(2, 0xaf3dff, 1);
		g2.arc(0, 0, 4, Math.PI / 2, -Math.PI / 2, true);
		g2.endFill();
		return g2;
	}

	function draw_arc_variant() {
		let g = new Graphics();
		g.lineStyle(2, 0xaf3dff, 1);
		g.arc(6, 0, 32.5, (2 / 5) * Math.PI, (-2 / 5) * Math.PI, true);
		g.moveTo(10, 22.5);
		g.arc(3.5, 0, 25, (2 / 5) * Math.PI, (-2 / 5) * Math.PI, true);
		g.lineStyle({
			width: 2,
			color: 0xaf3dff,
			shader: new DashLineShader({ dash: 2, gap: 3 }),
		});
		g.moveTo(20, 27.5);
		g.arc(7, 0, 35, (2 / 5) * Math.PI, (-2 / 5) * Math.PI, true);
		g.endFill();
		return g;
	}

	function draw_leaf_variant() {
		let g = new Graphics();
		g.lineStyle(2, 0xaf3dff, 1);
		g.moveTo(45, 0);
		g.bezierCurveTo(60, 33, 15, 66, 0, 100);
		g.bezierCurveTo(-15, 66, -60, 33, -45, 0);
		g.moveTo(47.5, 10);
		g.bezierCurveTo(60, 43, 15, 76, 0, 110);
		g.bezierCurveTo(-15, 76, -60, 43, -47.5, 10);
		g.lineStyle({
			width: 3,
			color: 0xaf3dff,
			shader: new DashLineShader({ dash: 3, gap: 6 }),
		});
		g.moveTo(30, 20);
		g.bezierCurveTo(40, 33, 10, 55, 0, 80);
		g.bezierCurveTo(-10, 55, -40, 33, -30, 20);
		g.rotation = -Math.PI / 2;
		g.scale.set(0.5, 0.5);
		g.endFill();
		return g;
	}

	function draw_leaf() {
		let g = new PIXI.Graphics();
		g.lineStyle(2, 0xaf3dff, 1);
		g.moveTo(0, 0);
		g.quadraticCurveTo(54, -50, 0, -95);
		g.quadraticCurveTo(-54, -50, 0, 0);
		g.moveTo(0, 10);
		g.quadraticCurveTo(54, -50, 0, -105);
		g.quadraticCurveTo(-54, -50, 0, 10);
		g.beginFill(0xaf3dff);
		g.drawEllipse(0, -72, 4, 8);
		g.rotation = Math.PI / 2;
		g.scale.set(0.5, 0.5);
		g.endFill();
		return g;
	}

	function draw_rectangle() {
		let g = new PIXI.Graphics();
		g.lineStyle(1, 0xaf3dff, 1);
		g.drawRect(0, 0, 10, 5);
		g.endFill();
		return g;
	}

	function draw_pill() {
		let g = new PIXI.Graphics();
		g.lineStyle(1, 0xaf3dff, 1);
		g.lineTo(6, 0);
		g.arc(7, -3.5, 3, Math.PI / 2, -Math.PI / 2, true);
		g.lineTo(0, -7);
		g.endFill();
		return g;
	}

	function draw_simple_petal() {
		let g = new Graphics();
		g.lineStyle(4, 0xaf3dff, 1);

		let [x1, y1, x2, y2, x3, y3, x4, y4] = [40, 33, 25, 66, -25, 66, -40, 33];
		g.moveTo(35, 0);
		g.bezierCurveTo(x1, y1, x2, y2, 0, 100);
		g.bezierCurveTo(x3, y3, x4, y4, -35, 0);

		let cp3 = [17.5, 20, 10, 45];
		let cp4 = [-10, 45, -17.5, 20];
		g.beginFill(0xaf3dff);
		g.moveTo(0, 10);
		g.bezierCurveTo(cp3[0], cp3[1], cp3[2], cp3[3], 0, 60);
		g.bezierCurveTo(cp4[0], cp4[1], cp4[2], cp4[3], 0, 10);

		g.rotation = -Math.PI / 2;
		g.scale.set(0.25, 0.25);
		g.endFill();

		return g;
	}

	function draw_bindi() {
		let g = new Graphics();
		g.lineStyle(2, 0xaf3dff, 1);

		let cp3 = [17.5, 20, 10, 45];
		let cp4 = [-10, 45, -17.5, 20];
		g.beginFill(0xaf3dff);
		g.moveTo(0, 10);
		g.bezierCurveTo(cp3[0], cp3[1], cp3[2], cp3[3], 0, 60);
		g.bezierCurveTo(cp4[0], cp4[1], cp4[2], cp4[3], 0, 10);

		g.rotation = -Math.PI / 2;
		g.scale.set(0.3, 0.3);
		g.endFill();
		return g;
	}

	function draw_rotated_petal() {
		let g = new Graphics();
		g.lineStyle(4, 0xaf3dff, 1);
		let [x1, y1, x2, y2, x3, y3, x4, y4] = [40, 33, 25, 66, -25, 66, -40, 33];
		g.moveTo(35, 0);
		g.bezierCurveTo(x1, y1, x2, y2, 0, 100);
		g.bezierCurveTo(x3, y3, x4, y4, -35, 0);
		g.scale.set(0.2, 0.2);
		g.endFill();
		return g;
	}

	function draw_curve() {
		let g = new Graphics();
		g.lineStyle(2, 0xaf3dff, 1);
		let [x1, y1, x2, y2] = [20, 25, 5, 60];
		g.moveTo(0, 0);
		g.bezierCurveTo(x1, y1, x2, y2, -25, 65);
		g.scale.set(0.5, 0.5);
		g.endFill();
		return g;
	}

	layerConstructor(draw_arrowhead, 72, 219, 0.0025);
	circleConstructor(5, 0xaf3dff, 215);
	circleConstructor(2, 0xaf3dff, 205);

	layerConstructor(draw_circle, 40, 190, 0.0025);
	layerConstructor(draw_semicircle, 72, 170, 0.0025);
	circleConstructor(2, 0xaf3dff, 170);
	circleConstructor(10, 0x000000, 163.5);

	layerConstructor(draw_arc_variant, 10, 120, -0.0025, -Math.PI / 2);
	layerConstructor(draw_leaf_variant, 10, 100, -0.0025);
	layerConstructor(draw_leaf, 20, 60, -0.0025);

	circleConstructor(30, 0x000000, 70);
	layerConstructor(draw_pill, 43, 75, -0.0025);
	circleConstructor(2, 0xaf3dff, 75);
	layerConstructor(draw_rectangle, 72, 60, -0.0025);

	layerConstructor(draw_curve, 8, 45, -0.0025, Math.PI / 8);
	layerConstructor(draw_bindi, 8, 35, -0.0025, Math.PI / 8);
	layerConstructor(draw_simple_petal, 8, 22.5, -0.0025);
	circleConstructor(1, 0xaf3dff, 22.5);
	layerConstructor(draw_rotated_petal, 8, 5, -0.0025);
	circleConstructor(2, 0xaf3dff, 1);
	
	// Set a square aspect ratio and resize
	let ratio;
	if (window.innerWidth > window.innerHeight) {
		ratio = window.innerHeight / 750;  
		app.stage.scale.set(ratio, ratio)
	} else {
		ratio = window.innerWidth / 750;
		app.stage.scale.set(ratio, ratio);
	}
	app.stage.x = window.innerWidth * (1 - ratio) / 2;
	app.stage.y = window.innerHeight * (1 - ratio) / 2;
	
	
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

<div use:addApp></div>

<style lang="scss">
	:global(body) {
		overflow: hidden;
	  background-color: #000000;
	}
	div {
		overflow: hidden;
	}
</style>