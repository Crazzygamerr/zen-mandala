<script lang="ts">
	import type { MandalaJSON } from '$lib/mandala';
	import Mandala from '$lib/mandala';
	import { writable } from 'svelte/store';
	import type { CircleParams } from '$lib/shape';
	// // import GIF from "gif.js";

	let backgroundColor = '#ffffff',
		outsideColor = '685369',
		middleColor = 'C6DCBA',
		insideColor = '35605A';

	// create a writable store for the mandalaState of type MandalaJSON
	const mandalaJSON = writable<MandalaJSON>({
		type: 'mandala',
		antialias: true,
		background: backgroundColor,
		layers: [
			{
				type: 'mandalaLayer',
				name: 'small circle',
				layerType: 'pattern',
				pattern: {
					itemCount: 20,
					radius: 65,
					itemGenerator: {
						type: 'shape',
						shapeType: 'circle',
						fillColor: insideColor,
						params: { radius: 3 } 
					}
				}
			},
			{
				type: 'mandalaLayer',
				name: 'rectangles',
				layerType: 'pattern',
				pattern: {
					itemCount: 24,
					radius: 25,
					itemGenerator: {
						type: 'shape',
						shapeType: 'rectangle',
						params: { width: 10, height: 17 }
					},
				}
			},
			{
				type: 'mandalaLayer',
				name: 'solid circle 1',
				layerType: 'container',
				children: [
					{
						type: 'shape',
						shapeType: 'circle',
						params: { lineWidth: 30, radius: 1 }
					}
				]
			}
		]
	});
	
	const mandalaApp = Mandala.fromJSON($mandalaJSON);

	function addApp(node: HTMLElement) {
		node.appendChild(mandalaApp.view as unknown as Node);
	}
</script>

<div use:addApp></div>
