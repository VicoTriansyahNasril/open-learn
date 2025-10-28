<script setup lang="ts">
import type { Course } from '~/server/types/course';

defineProps<{
    course: Course;
}>();
</script>

<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <img :src="course.imageUrl" :alt="course.title" class="w-full h-48 object-cover">
        <div class="p-6">
            <span class="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                {{ course.category }}
            </span>
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ course.title }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ course.description }}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-500 capitalize">{{ course.level }}</span>
                <NuxtLink :to="`/courses/${course.slug}`" class="text-indigo-600 font-semibold hover:underline">
                    Lihat Detail
                </NuxtLink>
            </div>
        </div>
    </div>
</template>