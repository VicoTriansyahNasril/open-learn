<script setup lang="ts">
import { useUiStore } from '@/shared/store/ui'

const uiStore = useUiStore()
</script>

<template>
    <aside class="bg-gray-800 text-gray-200 flex flex-col transition-all duration-300 ease-in-out"
        :class="uiStore.isSidebarOpen ? 'w-64' : 'w-20'">
        <div class="h-16 flex items-center justify-center border-b border-gray-700">
            <h1 class="text-xl font-bold text-white" v-show="uiStore.isSidebarOpen">
                Admin
            </h1>
            <h1 class="text-xl font-bold text-white" v-show="!uiStore.isSidebarOpen">
                OL
            </h1>
        </div>
        <nav class="flex-1 px-2 py-4 space-y-2">
            <RouterLink to="/" class="flex items-center p-2 rounded-lg hover:bg-gray-700">
                <span class="text-2xl">📊</span>
                <span class="ml-4 font-medium" v-show="uiStore.isSidebarOpen">Dashboard</span>
            </RouterLink>
            <RouterLink to="/courses" class="flex items-center p-2 rounded-lg hover:bg-gray-700">
                <span class="text-2xl">📚</span>
                <span class="ml-4 font-medium" v-show="uiStore.isSidebarOpen">Kursus</span>
            </RouterLink>
        </nav>
    </aside>
</template>