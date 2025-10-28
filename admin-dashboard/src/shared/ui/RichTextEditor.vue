<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { watch } from 'vue'

const props = defineProps<{
    modelValue: string | null | undefined
}>()

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({
            heading: { levels: [1, 2, 3] },
            blockquote: false,
            codeBlock: false,
            horizontalRule: false,
            link: false,
        }),
        Underline,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Link.configure({ openOnClick: false }),
        TextStyle,
        Color,
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    },
    editorProps: {
        attributes: {
            class: 'prose max-w-none p-4 focus:outline-none min-h-[300px]',
        },
    },
})

watch(
    () => props.modelValue,
    (newValue) => {
        if (!editor.value) return
        const html = newValue ?? ''
        const isSame = editor.value.getHTML() === html
        if (isSame) return
        editor.value.commands.setContent(html, { emitUpdate: false })
    }
)

function setLink() {
    if (!editor.value) return
    const url = window.prompt('URL', editor.value.getAttributes('link').href)
    if (url === null) return
    if (url === '') {
        editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
        return
    }
    editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function handleColorInput(event: Event) {
    if (editor.value) {
        const target = event.target as HTMLInputElement
        if (target) {
            editor.value.chain().focus().setColor(target.value).run()
        }
    }
}
</script>

<template>
    <div v-if="editor" class="border border-gray-300 rounded-md">
        <div class="p-2 border-b bg-gray-50 rounded-t-md flex flex-wrap items-center gap-x-1">
            <button type="button" @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'bg-gray-200': editor.isActive('bold') }" class="p-2 rounded hover:bg-gray-200" title="Bold">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79c0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79c0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z">
                    </path>
                </svg>
            </button>
            <button type="button" @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'bg-gray-200': editor.isActive('italic') }" class="p-2 rounded hover:bg-gray-200"
                title="Italic">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"></path>
                </svg>
            </button>
            <button type="button" @click="editor.chain().focus().toggleUnderline().run()"
                :class="{ 'bg-gray-200': editor.isActive('underline') }" class="p-2 rounded hover:bg-gray-200"
                title="Underline">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zM5 19v2h14v-2H5z">
                    </path>
                </svg>
            </button>
            <button type="button" @click="editor.chain().focus().toggleStrike().run()"
                :class="{ 'bg-gray-200': editor.isActive('strike') }" class="p-2 rounded hover:bg-gray-200"
                title="Strikethrough">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M14.22 14.22c-1.33.54-2.8.85-4.34.85c-3.14 0-5.87-1.55-7.42-4.01l1.6-.96c1.28 2.03 3.53 3.12 5.82 3.12c1.22 0 2.34-.26 3.32-.72l-2.45-2.45c-.4-.31-.48-.88-.23-1.28c.25-.4.78-.58 1.22-.43l4.68 1.56c.44.15.74.54.74 1c0 .2-.06.39-.18.55l-2.76 2.76zm-3.57-6.97l2.45 2.45c.4.31.48.88.23 1.28c-.25-.4-.78-.58-1.22-.43L7.43 9.85c-.44-.15-.74-.54-.74-1c0-.2.06-.39.18-.55l2.76-2.76c1.33-.54 2.8-.85 4.34-.85c3.14 0 5.87 1.55 7.42 4.01l-1.6.96c-1.28-2.03-3.53-3.12-5.82-3.12c-1.22 0-2.34-.26-3.32.72zM3 11h18v2H3v-2z">
                    </path>
                </svg>
            </button>
            <div class="relative inline-block" title="Text Color">
                <input type="color" @input="handleColorInput"
                    :value="editor.getAttributes('textStyle').color || '#000000'"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                <div class="p-2 rounded hover:bg-gray-200">
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M17.04 3.04c-.4 0-.78.16-1.07.45L14.5 4.96l4 4l1.47-1.47c.59-.59.59-1.54 0-2.12l-1.88-1.88c-.29-.29-.67-.45-1.07-.45zM13.06 6.39L4 15.45V19.5h4.05l9.06-9.06l-4.05-4.05zM5.5 18H5v-.5l8.06-8.06l.5.5L5.5 18z"
                            opacity=".3"></path>
                        <path fill="currentColor"
                            d="M17.75 6.91L16.34 5.5l-2.12 2.12l1.41 1.41l2.12-2.12zM6.92 19H5v-1.92l8.06-8.06l1.92 1.92L6.92 19zM17.04 3.04c-.4 0-.78.16-1.07.45l-1.88 1.88l-1.47-1.47c-.59-.59-1.54-.59-2.12 0L9.06 5.34l-2.12-2.12c-.59-.59-1.54-.59-2.12 0L3 5.06c-.59.59-.59 1.54 0 2.12l1.47 1.47l-1.47 1.47c-.59.59-.59 1.54 0 2.12l1.88 1.88c.29.29.67.45 1.07.45s.78-.16 1.07-.45l1.47-1.47l2.12 2.12c.59.59 1.54.59 2.12 0l1.88-1.88c.59-.59.59-1.54 0-2.12l-1.47-1.47l1.47-1.47c.59-.59.59-1.54 0-2.12l-1.88-1.88c-.29-.29-.67-.45-1.07-.45zM14.5 4.96l4 4l-1.47 1.47l-4-4L14.5 4.96zM4 15.45l9.06-9.06l4.05 4.05L8.05 19.5H4v-4.05z">
                        </path>
                    </svg>
                </div>
            </div>
            <div class="h-6 border-l mx-2"></div>
            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                :class="{ 'bg-gray-300': editor.isActive('heading', { level: 1 }) }"
                class="p-2 rounded hover:bg-gray-200 font-bold" title="Heading 1">H1</button>
            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'bg-gray-300': editor.isActive('heading', { level: 2 }) }"
                class="p-2 rounded hover:bg-gray-200 font-semibold" title="Heading 2">H2</button>
            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'bg-gray-300': editor.isActive('heading', { level: 3 }) }"
                class="p-2 rounded hover:bg-gray-200 font-medium" title="Heading 3">H3</button>
            <div class="h-6 border-l mx-2"></div>
            <button type="button" @click="editor.chain().focus().setTextAlign('left').run()"
                :class="{ 'bg-gray-300': editor.isActive({ textAlign: 'left' }) }" class="p-2 rounded hover:bg-gray-200"
                title="Align Left">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h12V7H3v2zm0-6v2h18V3H3z"></path>
                </svg>
            </button>
            <button type="button" @click="editor.chain().focus().setTextAlign('center').run()"
                :class="{ 'bg-gray-300': editor.isActive({ textAlign: 'center' }) }"
                class="p-2 rounded hover:bg-gray-200" title="Align Center">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M3 21h18v-2H3v2zm4-4h10v-2H7v2zm-4-4h18v-2H3v2zm4-4h10V7H7v2zM3 3v2h18V3H3z"></path>
                </svg>
            </button>
            <button type="button" @click="editor.chain().focus().setTextAlign('right').run()"
                :class="{ 'bg-gray-300': editor.isActive({ textAlign: 'right' }) }"
                class="p-2 rounded hover:bg-gray-200" title="Align Right">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M3 21h18v-2H3v2zm8-4h10v-2H11v2zm-8-4h18v-2H3v2zm8-4h10V7H11v2zM3 3v2h18V3H3z"></path>
                </svg>
            </button>
            <div class="h-6 border-l mx-2"></div>
            <button type="button" @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'bg-gray-300': editor.isActive('bulletList') }" class="p-2 rounded hover:bg-gray-200"
                title="Bullet List">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M7 5h14v2H7V5zm0 6h14v2H7v-2zm0 6h14v2H7v-2zM4 5a2 2 0 1 0 0-4a2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4a2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4a2 2 0 0 0 0 4z">
                    </path>
                </svg>
            </button>
            <button type="button" @click="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'bg-gray-300': editor.isActive('orderedList') }" class="p-2 rounded hover:bg-gray-200"
                title="Ordered List">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M7 5h14v2H7V5zm0 6h14v2H7v-2zm0 6h14v2H7v-2zM4.3 2.7L3.1 3.9c-.2.2-.2.5 0 .7l.9.9c.2.2.5.2.7 0l1.2-1.2c.2-.2.2-.5 0-.7l-.9-.9c-.2-.2-.5-.2-.7 0zM3.8 9c0-.4.4-.8.8-.8s.8.4.8.8c0 .4-.4.8-.8.8s-.8-.4-.8-.8zm0 6c0-.4.4-.8.8-.8s.8.4.8.8c0 .4-.4.8-.8.8s-.8-.4-.8-.8z">
                    </path>
                </svg>
            </button>
            <div class="h-6 border-l mx-2"></div>
            <button type="button" @click="setLink" :class="{ 'bg-gray-300': editor.isActive('link') }"
                class="p-2 rounded hover:bg-gray-200" title="Add Link">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z">
                    </path>
                </svg>
            </button>
        </div>
        <EditorContent :editor="editor" />
    </div>
</template>