<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/shared/api';

const form = ref({
    email: '',
    password: '',
});

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const router = useRouter();

async function handleLogin() {
    isLoading.value = true;
    errorMessage.value = null;
    try {
        const response = await api.post('/auth/login', form.value);

        if (response.data.role !== 'ADMIN') {
            errorMessage.value = 'Akses ditolak. Akun Anda bukan admin.';
            return;
        }

        await router.push('/');

    } catch (error: any) {
        errorMessage.value = error.response?.data?.statusMessage || 'Terjadi kesalahan saat login.';
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="w-full max-w-md">
            <div class="bg-white shadow-lg rounded-xl p-8">
                <h2 class="text-center text-2xl font-bold text-gray-800 mb-6">
                    Admin Login
                </h2>
                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input v-model="form.email" type="email" id="email" required
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input v-model="form.password" type="password" id="password" required
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                        <p>{{ errorMessage }}</p>
                    </div>
                    <div>
                        <button type="submit" :disabled="isLoading"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                            <span v-if="isLoading"
                                class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            <span v-else>Masuk</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>