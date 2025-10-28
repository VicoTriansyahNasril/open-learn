<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/shared/api'

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    xp: number;
    level: number;
    createdAt: string;
}

const users = ref<User[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
    try {
        // API ini belum ada, kita perlu cara untuk admin login
        const response = await api.get<User[]>('/users')
        users.value = response.data
    } catch (err) {
        error.value = 'Gagal mengambil data pengguna. Pastikan Anda login sebagai admin.'
    } finally {
        isLoading.value = false
    }
})

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-800">Manajemen Pengguna</h1>
        </div>

        <div class="bg-white shadow rounded-lg overflow-x-auto">
            <div v-if="isLoading" class="p-6 text-center">Memuat data...</div>
            <div v-else-if="error" class="p-6 text-center text-red-500">{{ error }}</div>
            <table v-else class="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th
                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Nama
                        </th>
                        <th
                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Email
                        </th>
                        <th
                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Level
                        </th>
                        <th
                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            XP
                        </th>
                        <th
                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Bergabung
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-gray-900 whitespace-no-wrap">{{ user.name }}</p>
                            <p class="text-gray-600 whitespace-no-wrap text-xs capitalize">{{ user.role.toLowerCase() }}
                            </p>
                        </td>
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-gray-900 whitespace-no-wrap">{{ user.email }}</p>
                        </td>
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span class="font-bold text-lg text-indigo-600">{{ user.level }}</span>
                        </td>
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-gray-900 whitespace-no-wrap">{{ user.xp }}</p>
                        </td>
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-gray-900 whitespace-no-wrap">{{ formatDate(user.createdAt) }}</p>
                        </td>
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                            <button class="text-indigo-600 hover:text-indigo-900">Detail</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>