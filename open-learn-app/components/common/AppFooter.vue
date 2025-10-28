<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
    <footer class="bg-gray-800 text-white">
        <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <p>&copy; {{ currentYear }} OpenLearn. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>