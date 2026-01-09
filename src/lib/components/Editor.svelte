<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import Toolbar from './Toolbar.svelte';

	interface Props {
		value?: string;
		// name?: string;
		editable?: boolean;
		class?: string;
	}

	let { 
		value = $bindable(''), 
		editable = true,
		// name = 'content',
		class: className = '' 
	}: Props = $props();

	let element: HTMLDivElement |HTMLTextAreaElement| undefined = $state();
	let editor: Editor | undefined = $state();

	onMount(() => {
		if (!element) return;

		editor = new Editor({
			element: element,
			editable: editable, // Initial state
			extensions: [
				StarterKit,
				Image.configure({ inline: true, allowBase64: true })
			],
			content: value,
			onUpdate: ({ editor }) => {
				value = editor.getHTML();
			},
			editorProps: {
				attributes: {
					// We add 'prose' here so both Edit and Read modes look good
					class: `prose prose-sm sm:prose-base focus:outline-none min-h-[300px] max-w-none px-4 py-4 ${className}`
				}
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	// Reactive: Handle 'editable' prop changes dynamically
	$effect(() => {
		if (editor) {
			editor.setEditable(editable);
		}
	});

	// Reactive: Handle external 'value' changes
	$effect(() => {
		if (editor && value !== editor.getHTML()) {
			if (editor.getText() === '' && value === '') return;
			editor.commands.setContent(value);
		}
	});
</script>

<div class="relative flex flex-col w-full border rounded-lg bg-white shadow-sm transition-colors duration-200 {editable ? 'border-gray-300' : 'border-transparent shadow-none'}">
	
	<!-- Only show Toolbar if editable and editor exists -->
	{#if editor && editable}
		<Toolbar {editor} />
	{/if}
	<!-- <input type="hidden" {name} bind:value={value} /> -->

	<!-- Editor Content Area -->
	<!-- <div 
		bind:this={element} 
		class="flex-grow min-h-[100px] cursor-text"
	></div>-->
	<textarea
	id="content"
	name="content"
	bind:this={element}
	required
	rows="12"
	class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
	></textarea> 
</div> 