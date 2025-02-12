<script lang="ts">
	import type { MandalaJSON } from '$lib/mandala';
	import Mandala from '$lib/mandala';
	import { writable } from 'svelte/store';
	import type { CircleParams } from '$lib/shape';
	import { GenerativeModel, GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
	import type { MandalaLayerJSON } from '$lib/mandalaLayer';
	import MandalaLayer from '$lib/mandalaLayer';
	
	let mandalaApp: Mandala;
	let genAI: GoogleGenerativeAI;
	let model: GenerativeModel;
	let apiKey = getApiKey(), keyInput = '';
	
	const schema = {
		description: "List of mandala layers",
		type: SchemaType.ARRAY,
		items: {
			type: SchemaType.OBJECT,
			properties: {
				type: {
					type: SchemaType.STRING,
					enum: ["mandalaLayer"],
				},
				name: {
					type: SchemaType.STRING,
				},
				layerType: {
					type: SchemaType.STRING,
					enum: ["pattern", "container"],
				},
				pattern: {
					type: SchemaType.OBJECT,
					properties: {
						itemCount: {
							type: SchemaType.INTEGER,
						},
						radius: {
							type: SchemaType.INTEGER,
						},
						itemGenerator: {
							type: SchemaType.OBJECT,
							properties: {
								type: {
									type: SchemaType.STRING,
									enum: ["shape"],
								},
								shapeType: {
									type: SchemaType.STRING,
									enum: ["arrowhead", "arc_variant", "leaf_variant", "leaf", "half_pill", "simple_petal", "bindi", "inverted_thorn", "rectangle", "circle", "triangle", "none"],
								},
								fillColor: {
									type: SchemaType.STRING,
								},
								params: {
									type: SchemaType.OBJECT,
									properties: {
										radius: {
											type: SchemaType.INTEGER,
										},
										width: {
											type: SchemaType.INTEGER,
										},
										height: {
											type: SchemaType.INTEGER,
										},
									},
								},
							},
							required: ["shapeType", "type" ],
						},
					},
					required: ["itemCount", "radius", "itemGenerator"],
				},
				children: {
					type: SchemaType.ARRAY,
					items: {
						type: SchemaType.OBJECT,
						properties: {
							type: {
								type: SchemaType.STRING,
								enum: ["shape"],
							},
							shapeType: {
								type: SchemaType.STRING,
								enum: ["circle", "rectangle"],
							},
							params: {
								type: SchemaType.OBJECT,
								properties: {
									lineWidth: {
										type: SchemaType.INTEGER,
									},
									radius: {
										type: SchemaType.INTEGER,
									},
									width: {
										type: SchemaType.INTEGER,
									},
									height: {
										type: SchemaType.INTEGER,
									},
								},
								required: ["lineWidth", "radius"],
							},
						},
						required: ["shapeType", "params"],
					},
				},
			},
			required: ["name", "type", "layerType"],
		},
	};
	
	if (apiKey) {
		initAI(apiKey);
	}
	
  function saveApiKey() {
		apiKey = keyInput;
		keyInput = '';
    localStorage.setItem('apiKey', apiKey);
		initAI(apiKey as string);
  }

  function getApiKey() {
    return localStorage.getItem('apiKey');
  }
	
	function initAI(apiKey: string) {
		genAI = new GoogleGenerativeAI(apiKey);
		model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			generationConfig: {
				responseMimeType: "application/json",
				responseSchema: schema,
			},
		});
	}

	let prompt = "";
	
	async function handleSubmit(event) {
    if (event.key === 'Enter') {
      console.log('Submitted value:', prompt);
			const result = await model.generateContent("Modify the mandala layers json according to the prompt. \n" + JSON.stringify(mandalaJSON) + "\n" + prompt);
			console.log('Generated result:', result.response.text());
			
			// console.log( typeof mandalaJSON.layers as unknown as MandalaLayerJSON[]);
			// let a = JSON.parse('[{"layerType": "pattern", "name": "small circle", "type": "mandalaLayer", "pattern": {"itemCount": 20, "itemGenerator": {"shapeType": "circle", "type": "shape", "fillColor": "#35605A", "params": {"radius": 3}}, "radius": 65}}, {"layerType": "pattern", "name": "rectangles", "type": "mandalaLayer", "pattern": {"itemCount": 24, "itemGenerator": {"shapeType": "rectangle", "type": "shape", "params": {"width": 10.000000000000002}}, "radius": 25}}, {"layerType": "container", "name": "solid circle 1", "type": "mandalaLayer", "children": [{"params": {"lineWidth": 30, "radius": 1}, "shapeType": "circle", "type": "shape"}]}]') as MandalaLayerJSON[];
			// console.log( a instanceof Array);
			
			mandalaApp.loadLayers({
				type: 'mandala',
				layers: JSON.parse(result.response.text()) as MandalaLayerJSON[]
			});
      prompt = '';
    }
  }
	
	let backgroundColor = '#ffffff',
		outsideColor = '685369',
		middleColor = 'C6DCBA',
		insideColor = '35605A';

	// create a writable store for the mandalaState of type MandalaJSON
	const mandalaJSON = {
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
	};
	
 	mandalaApp = Mandala.fromJSON(mandalaJSON as MandalaJSON);

	function addApp(node: HTMLElement) {
		node.appendChild(mandalaApp.view as unknown as Node);
	}
</script>

<div>
	<!-- input for API Key -->
	{#if apiKey === null || apiKey === ''}
		<input type="text" bind:value={keyInput} placeholder="Enter your API Key" />
		<button on:click={saveApiKey}>Save API Key</button>
	{:else}
		<div use:addApp/>
		<input
			type="text"
			bind:value={prompt}
			on:keydown={handleSubmit}
			placeholder="Enter some text and press Enter"
		/>
	{/if}
</div>
