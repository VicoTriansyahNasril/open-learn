<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUiStore } from '@/shared/store/ui'
import api from '@/shared/api'

const uiStore = useUiStore()
const router = useRouter()

async function handleLogout() {
    try {
        await api.post('/auth/logout')
        await router.push('/login')
    } catch (error) {
        console.error('Logout failed:', error)
        alert('Gagal untuk logout. Silakan coba lagi.')
    }
}
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
            <RouterLink to="/users" class="flex items-center p-2 rounded-lg hover:bg-gray-700">
                <span class="text-2xl">👥</span>
                <span class="ml-4 font-medium" v-show="uiStore.isSidebarOpen">Pengguna</span>
            </RouterLink>
            <RouterLink to="/questions" class="flex items-center p-2 rounded-lg hover:bg-gray-700">
                <span class="text-2xl">❓</span>
                <span class="ml-4 font-medium" v-show="uiStore.isSidebarOpen">Bank Soal</span>
            </RouterLink>
        </nav>
        <div class="px-2 py-4 mt-auto border-t border-gray-700">
            <button @click="handleLogout" class="w-full flex items-center p-2 rounded-lg hover:bg-red-700">
                <span class="text-2xl">🚪</span>
                <span class="ml-4 font-medium" v-show="uiStore.isSidebarOpen">Keluar</span>
            </button>
        </div>
    </aside>
</template>