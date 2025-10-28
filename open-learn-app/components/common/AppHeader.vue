<script setup lang="ts">
</script>

<template>
    <header class="bg-white shadow-sm">
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
                <div class="flex items-center space-x-4">
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