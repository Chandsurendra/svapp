<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { onDestroy } from 'svelte';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
	
	// Local state to force UI updates when cursor moves
	let selectionTick = $state(0);

	// Update tick on every transaction
	const update = () => selectionTick++;

	// Subscribe to editor updates
	// We use $effect.pre or just standard setup because we need to attach listeners
	$effect(() => {
		if (editor) {
			editor.on('transaction', update);
			editor.on('selectionUpdate', update);
		}
		return () => {
			if (editor) {
				editor.off('transaction', update);
				editor.off('selectionUpdate', update);
			}
		};
	});

	// Calculate active states
	let active = $derived.by(() => {
		selectionTick; // Dependency
		return {
			h1: editor.isActive('heading', { level: 1 }),
			h2: editor.isActive('heading', { level: 2 }),
			bold: editor.isActive('bold'),
			italic: editor.isActive('italic'),
			strike: editor.isActive('strike'),
			bullet: editor.isActive('bulletList'),
			ordered: editor.isActive('orderedList'),
			quote: editor.isActive('blockquote')
		};
	});

	function addImage() {
		const url = window.prompt('Image URL');
		if (url) editor.chain().focus().setImage({ src: url }).run();
	}

	// Styles
	const btnBase = "p-2 rounded text-sm font-medium transition-colors border border-transparent";
	const btnActive = "bg-black text-white border-black hover:bg-gray-800";
	const btnInactive = "text-gray-600 hover:bg-gray-200 hover:text-black";
	const separator = "w-px h-6 bg-gray-300 mx-1 self-center";

	function getBtnClass(isActive: boolean): string {
		return `${btnBase} ${isActive ? btnActive : btnInactive}`;
	}
</script>

<div class="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80 rounded-t-lg transition-all duration-200">
	<button
		onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class={getBtnClass(active.h1)}
		type="button"
	>
		H1
	</button>
	<button
		onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class={getBtnClass(active.h2)}
		type="button"
	>
		H2
	</button>

	<div class={separator}></div>

	<button
		onclick={() => editor.chain().focus().toggleBold().run()}
		disabled={!editor.can().chain().focus().toggleBold().run()}
		class={getBtnClass(active.bold)}
		type="button"
	>
		<strong>B</strong>
	</button>
	<button
		onclick={() => editor.chain().focus().toggleItalic().run()}
		disabled={!editor.can().chain().focus().toggleItalic().run()}
		class={getBtnClass(active.italic)}
		type="button"
	>
		<em>I</em>
	</button>
	<button
		onclick={() => editor.chain().focus().toggleStrike().run()}
		disabled={!editor.can().chain().focus().toggleStrike().run()}
		class={getBtnClass(active.strike)}
		type="button"
	>
		<span class="line-through">S</span>
	</button>

	<div class={separator}></div>

	<button
		onclick={() => editor.chain().focus().toggleBulletList().run()}
		class={getBtnClass(active.bullet)}
		type="button"
	>
		• List
	</button>
	<button
		onclick={() => editor.chain().focus().toggleOrderedList().run()}
		class={getBtnClass(active.ordered)}
		type="button"
	>
		1. List
	</button>

	<div class={separator}></div>

	<button onclick={addImage} class={getBtnClass(false)} type="button">
		Image
	</button>
	<button
		onclick={() => editor.chain().focus().toggleBlockquote().run()}
		class={getBtnClass(active.quote)}
		type="button"
	>
		Quote
	</button>
</div>