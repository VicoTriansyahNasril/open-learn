<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

async function handleLogout() {
    await $fetch('/api/auth/logout', { method: 'POST' });
    authStore.setUser(null);
    await navigateTo('/login');
}
</script>

<template>
    <header class="bg-white shadow-sm sticky top-0 z-40">
        <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex-shrink-0">
                    <NuxtLink to="/" class="text-2xl font-bold text-gray-800">
                        OpenLearn
                    </NuxtLink>
                </div>
                <div class="hidden md:flex md:space-x-8">
                    <NuxtLink to="/courses" class="text-gray-600 hover:text-gray-800 font-medium">
                        Kursus
                    </NuxtLink>
                    <NuxtLink to="/blog" class="text-gray-600 hover:text-gray-800 font-medium">
                        Blog
                    </NuxtLink>
                </div>

                <!-- Tampilan untuk Pengguna yang Sudah Login -->
                <div v-if="authStore.isLoggedIn && authStore.user" class="flex items-center space-x-4">
                    <span class="text-sm font-medium text-gray-700">
                        Halo, {{ authStore.user.name }}
                    </span>
                    <NuxtLink to="/me" class="text-sm font-medium text-gray-700 hover:text-indigo-600">
                        Profil Saya
                    </NuxtLink>
                    <button @click="handleLogout"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
                        Keluar
                    </button>
                </div>

                <!-- Tampilan untuk Tamu -->
                <div v-else class="flex items-center space-x-4">
                    <NuxtLink to="/login" class="text-sm font-medium text-gray-700 hover:text-indigo-600">
                        Masuk
                    </NuxtLink>
                    <NuxtLink to="/register"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">
                        Daftar
                    </NuxtLink>
                </div>
            </div>
        </nav>
    </header>
</template>