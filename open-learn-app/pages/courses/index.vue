<script setup lang="ts">
import type { Course } from '~/server/types/course';

const { data: courses, pending, error } = await useFetch<Course[]>('/api/courses');

</script>

<template>
  <div class="bg-gray-50">
    <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Jelajahi Semua Kursus
      </h1>

      <div v-if="pending" class="text-center">
        Memuat kursus...
      </div>

      <div v-else-if="error" class="text-center text-red-500">
        Gagal memuat kursus. Coba lagi nanti.
      </div>

      <div v-else-if="courses" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CourseCard v-for="course in courses" :key="course.id" :course="course" />
      </div>
    </div>
  </div>
</template>