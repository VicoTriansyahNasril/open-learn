<script setup lang="ts">
import AppSidebar from '@/widgets/AppSidebar.vue'
import AppHeader from '@/widgets/AppHeader.vue'
</script>

<template>
    <div class="flex h-screen bg-gray-100">
        <AppSidebar />
        <div class="flex-1 flex flex-col overflow-hidden">
            <AppHeader />
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div class="container mx-auto px-6 py-8">
                    <RouterView />
                </div>
            </main>
        </div>
    </div>
</template>