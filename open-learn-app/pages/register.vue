<script setup lang="ts">
const form = ref({
  name: '',
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}

async function handleRegister() {
  isLoading.value = true
  errorMessage.value = null
  successMessage.value = null
  try {
    const response = await $fetch<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: form.value
    })
    successMessage.value = `${response.message}. Silakan login.`
    form.value = { name: '', email: '', password: '' }
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'Terjadi kesalahan saat registrasi.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Buat Akun Baru
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Atau
        <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          masuk ke akun Anda
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"> Nama </label>
            <div class="mt-1">
              <input v-model="form.name" id="name" name="name" type="text" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Alamat Email </label>
            <div class="mt-1">
              <input v-model="form.email" id="email" name="email" type="email" autocomplete="email" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
            <div class="mt-1">
              <input v-model="form.password" id="password" name="password" type="password"
                autocomplete="current-password" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>
          <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert">
            <span class="block sm:inline">{{ errorMessage }}</span>
          </div>
          <div v-if="successMessage"
            class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ successMessage }}</span>
          </div>
          <div>
            <button type="submit" :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {{ isLoading ? 'Mendaftar...' : 'Daftar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>