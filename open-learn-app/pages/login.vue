<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const form = ref({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const authStore = useAuthStore();

async function handleLogin() {
  isLoading.value = true
  errorMessage.value = null
  try {
    const user = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })
    authStore.setUser(user); // Perbarui state Pinia
    await navigateTo('/')
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'Terjadi kesalahan saat login.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Masuk ke Akun Anda
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Atau
        <NuxtLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
          buat akun baru
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 transform transition-all hover:scale-105 duration-300">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Alamat Email </label>
            <div class="mt-1">
              <input v-model="form.email" id="email" name="email" type="email" autocomplete="email" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow duration-200">
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
            <div class="mt-1">
              <input v-model="form.password" id="password" name="password" type="password"
                autocomplete="current-password" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow duration-200">
            </div>
          </div>
          <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{{ errorMessage }}</p>
          </div>
          <div>
            <button type="submit" :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors duration-200">
              <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              <span v-else>Masuk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>