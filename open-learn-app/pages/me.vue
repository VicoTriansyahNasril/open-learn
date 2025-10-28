<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
</script>

<template>
    <div class="container mx-auto py-10 px-4">
        <div v-if="authStore.user">
            <h1 class="text-3xl font-bold">Profil Saya</h1>
            <div class="mt-6 bg-white shadow rounded-lg p-6">
                <div class="space-y-4">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Nama</p>
                        <p class="mt-1 text-lg text-gray-900">{{ authStore.user.name }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Email</p>
                        <p class="mt-1 text-lg text-gray-900">{{ authStore.user.email }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Peran</p>
                        <p class="mt-1 text-lg text-gray-900 capitalize">{{ authStore.user.role.toLowerCase() }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>