
<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { Underline } from '@tiptap/extension-underline';
	import { TextStyle } from '@tiptap/extension-text-style';
	import { Color } from '@tiptap/extension-color';
	import { Highlight } from '@tiptap/extension-highlight';
	import { Blockquote } from '@tiptap/extension-blockquote';
	import { CodeBlock } from '@tiptap/extension-code-block';
	import { BulletList } from '@tiptap/extension-bullet-list';
	import { OrderedList } from '@tiptap/extension-ordered-list';
	import { Link } from '@tiptap/extension-link';
	import { Image } from '@tiptap/extension-image';
	import { Youtube } from '@tiptap/extension-youtube';
	import { Table } from '@tiptap/extension-table';
	import { TableRow } from '@tiptap/extension-table-row';
	import { TableCell } from '@tiptap/extension-table-cell';
	import { TableHeader } from '@tiptap/extension-table-header';
	import { BubbleMenu } from '@tiptap/extension-bubble-menu';
	import { FloatingMenu } from '@tiptap/extension-floating-menu';
	import { onMount, onDestroy } from 'svelte';

	let {
		content = '',
		editable = true,
		onUpdate = (newContent: string) => {}
	} = $props();

	let editor = $state<Editor | null>(null);
	let editorRef = $state<HTMLElement | null>(null);
	let bubbleMenuRef = $state<HTMLElement | null>(null);
	let floatingMenuRef = $state<HTMLElement | null>(null);

	let isFullscreen = $state(false);

	onMount(() => {
		editor = new Editor({
			element: editorRef,
			extensions: [
				StarterKit,
				Underline,
				TextStyle,
				Color,
				Highlight.configure({ multicolor: true }),
				Blockquote,
				CodeBlock,
				BulletList,
				OrderedList,
				Link.configure({
					openOnClick: false
				}),
				Image,
				Youtube,
				Table.configure({
					resizable: true
				}),
				TableRow,
				TableCell,
				TableHeader,
				BubbleMenu.configure({
					element: bubbleMenuRef,
				}),
				FloatingMenu.configure({
					element: floatingMenuRef,
				})
			],
			content: content,
			editable: editable,
			onUpdate: ({ editor }) => {
				onUpdate(editor.getHTML());
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	function toggleFullscreen() {
		isFullscreen = !isFullscreen;
	}

	function setLink() {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		// update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	function addImage() {
		const url = window.prompt('URL');

		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	}
</script>

<div class="tiptap-editor {isFullscreen ? 'fullscreen' : ''}">
	{#if editable && editor}
		<div class="toolbar">
			<div class="dropdown">
				<button class="dropdown-toggle">Headings</button>
				<div class="dropdown-menu">
					<button onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} class:active={editor.isActive('heading', { level: 1 })}>H1</button>
					<button onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} class:active={editor.isActive('heading', { level: 2 })}>H2</button>
					<button onclick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} class:active={editor.isActive('heading', { level: 3 })}>H3</button>
					<button onclick={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>Paragraph</button>
				</div>
			</div>
			<button onclick={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')}>Bold</button>
			<button onclick={() => editor.chain().focus().toggleItalic().run()} class:active={editor.isActive('italic')}>Italic</button>
			<button onclick={() => editor.chain().focus().toggleUnderline().run()} class:active={editor.isActive('underline')}>Underline</button>
			<button onclick={() => editor.chain().focus().toggleStrike().run()} class:active={editor.isActive('strike')}>Strike</button>
			<button onclick={() => editor.chain().focus().toggleHighlight().run()} class:active={editor.isActive('highlight')}>Highlight</button>
			<div class="dropdown">
				<button class="dropdown-toggle">Color</button>
				<div class="dropdown-menu">
					<input type="color" oninput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()} value={editor.getAttributes('textStyle').color}>
					<button onclick={() => editor.chain().focus().unsetColor().run()}>Default</button>
				</div>
			</div>
			<button onclick={() => editor.chain().focus().toggleBlockquote().run()} class:active={editor.isActive('blockquote')}>Quote</button>
			<button onclick={() => editor.chain().focus().toggleCodeBlock().run()} class:active={editor.isActive('codeBlock')}>Code</button>
			<button onclick={() => editor.chain().focus().toggleBulletList().run()} class:active={editor.isActive('bulletList')}>List</button>
			<button onclick={() => editor.chain().focus().toggleOrderedList().run()} class:active={editor.isActive('orderedList')}>Ordered List</button>
			<button onclick={setLink} class:active={editor.isActive('link')}>Link</button>
			<button onclick={addImage}>Image</button>
			<button onclick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
			<button onclick={toggleFullscreen}>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</button>
		</div>

		<div bind:this={bubbleMenuRef} class="bubble-menu">
			<button onclick={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')}>Bold</button>
			<button onclick={() => editor.chain().focus().toggleItalic().run()} class:active={editor.isActive('italic')}>Italic</button>
			<button onclick={() => editor.chain().focus().toggleStrike().run()} class:active={editor.isActive('strike')}>Strike</button>
		</div>

		<div bind:this={floatingMenuRef} class="floating-menu">
			<button onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
			<button onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
			<button onclick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</button>
		</div>
	{/if}
	<div bind:this={editorRef} class="editor-content"></div>
</div>

<style>
	.tiptap-editor {
		border: 1px solid #ccc;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
	}
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		padding: 10px;
		border-bottom: 1px solid #ccc;
		background-color: #f5f5f5;
	}
	.toolbar button, .dropdown-toggle {
		background: none;
		border: 1px solid transparent;
		padding: 5px 10px;
		cursor: pointer;
		border-radius: 3px;
		margin-right: 5px;
		margin-bottom: 5px;
	}
	.toolbar button.active {
		background: #eee;
		border-color: #ccc;
	}
    .toolbar button:hover, .dropdown-toggle:hover {
        background-color: #e0e0e0;
    }
	.editor-content {
		padding: 10px;
		min-height: 200px;
		flex-grow: 1;
		overflow-y: auto;
	}
	.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: white;
		z-index: 1000;
		margin: 0;
		border-radius: 0;
		border: none;
	}
	.dropdown {
		position: relative;
		display: inline-block;
	}
	.dropdown-menu {
		display: none;
		position: absolute;
		background-color: white;
		box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
		z-index: 1;
		border-radius: 5px;
		padding: 5px;
		min-width: 160px;
	}
	.dropdown:hover .dropdown-menu {
		display: block;
	}
	.dropdown-menu button {
		width: 100%;
		text-align: left;
		margin-bottom: 2px;
	}
	.bubble-menu, .floating-menu {
		display: flex;
		background-color: #333;
		padding: 0.2rem;
		border-radius: 0.5rem;
	}
	.bubble-menu button, .floating-menu button {
		border: none;
		background: none;
		color: #fff;
		font-size: 0.85rem;
		font-weight: 500;
		padding: 0 0.2rem;
		opacity: 0.6;
	}
    .bubble-menu button:hover, .floating-menu button:hover,
    .bubble-menu button.active {
        opacity: 1;
    }
</style>
