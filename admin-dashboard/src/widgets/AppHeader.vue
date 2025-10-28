<script setup lang="ts">
import { useUiStore } from '@/shared/store/ui'

const uiStore = useUiStore()
</script>

<template>
    <header class="bg-white shadow-sm h-16 flex items-center px-6">
        <button @click="uiStore.toggleSidebar" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    </header>
</template>