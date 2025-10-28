<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

function closeModal() {
    emit('update:modelValue', false);
}
</script>

<template>
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeModal">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <header class="p-4 border-b flex justify-between items-center">
                <slot name="header">
                    <h2 class="text-lg font-semibold">Modal Title</h2>
                </slot>
                <button @click="closeModal" class="text-gray-500 hover:text-gray-800">&times;</button>
            </header>
            <main class="p-6">
                <slot />
            </main>
            <footer v-if="$slots.footer" class="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                <slot name="footer" />
            </footer>
        </div>
    </div>
</template>