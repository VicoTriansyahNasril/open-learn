<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/shared/api';
import ModuleList from '@/features/course/ModuleList.vue'; // <-- Impor komponen

// Definisikan tipe data yang lebih lengkap
interface Lesson {
    id: string;
    title: string;
    order: number;
}
interface Module {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}
interface Course {
    id: string;
    title: string;
    modules: Module[];
}

const route = useRoute();
const course = ref<Course | null>(null);
const isLoading = ref(true);

onMounted(async () => {
    const courseId = route.params.id;
    if (typeof courseId === 'string') {
        try {
            const response = await api.get(`/courses/${courseId}`);
            course.value = response.data;
        } catch (error) {
            console.error("Gagal mengambil detail kursus", error);
        } finally {
            isLoading.value = false;
        }
    }
});
</script>

<template>
    <div>
        <div v-if="isLoading">
            Memuat detail kursus...
        </div>
        <div v-else-if="course">
            <h1 class="text-3xl font-bold mb-4">{{ course.title }}</h1>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <h2 class="text-xl font-semibold mb-4">Modul & Pelajaran</h2>
                    <div class="bg-white p-6 rounded-lg shadow">
                        <!-- Ganti konten placeholder dengan komponen ModuleList -->
                        <ModuleList :initial-modules="course.modules" :course-id="course.id" />
                    </div>
                </div>
                <div>
                    <h2 class="text-xl font-semibold mb-4">Pengaturan Kursus</h2>
                    <div class="bg-white p-6 rounded-lg shadow">
                        <p class="text-gray-500">Pengaturan untuk kursus ini akan ditampilkan di sini.</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Kursus tidak ditemukan.
        </div>
    </div>
</template>