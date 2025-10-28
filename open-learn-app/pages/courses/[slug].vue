<script setup lang="ts">
const route = useRoute();
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;

const { data: course, pending, error } = await useAsyncData(
    `course-${slug}`,
    () => $fetch(`/api/courses/slug/${slug}`)
);

if (error.value) {
    console.error("Gagal mengambil data kursus:", error.value);
}

useSeoMeta({
    title: () => course.value?.title || 'Detail Kursus',
    description: () => course.value?.description || 'Deskripsi kursus.',
});
</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <div v-if="pending" class="text-center py-20">
            Memuat kursus...
        </div>
        <div v-else-if="error || !course" class="text-center py-20">
            <h1 class="text-2xl font-bold">Kursus Tidak Ditemukan</h1>
            <p class="text-gray-600 mt-2">Kursus yang Anda cari mungkin telah dihapus atau URL-nya salah.</p>
            <NuxtLink to="/courses" class="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md">
                Kembali ke Daftar Kursus
            </NuxtLink>
        </div>
        <div v-else>
            <header class="bg-white shadow">
                <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 class="text-4xl font-extrabold text-gray-900">{{ course.title }}</h1>
                    <p class="mt-4 text-lg text-gray-600 max-w-3xl">{{ course.description }}</p>
                    <div class="mt-6">
                        <span
                            class="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mr-3">{{
                            course.category }}</span>
                        <span
                            class="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full capitalize">{{
                            course.level }}</span>
                    </div>
                </div>
            </header>

            <main class="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div class="max-w-3xl mx-auto">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Materi Kursus</h2>
                    <div class="space-y-4">
                        <div v-for="module in course.modules" :key="module.id" class="border rounded-lg">
                            <details class="group" :open="module.order === 1">
                                <summary
                                    class="p-4 cursor-pointer font-semibold text-lg flex justify-between items-center bg-gray-100 rounded-t-lg group-open:rounded-b-none">
                                    {{ module.order }}. {{ module.title }}
                                    <span class="transform transition-transform group-open:rotate-180">&#9660;</span>
                                </summary>
                                <ul class="p-4 bg-white rounded-b-lg">
                                    <li v-for="lesson in module.lessons" :key="lesson.id"
                                        class="flex items-center justify-between py-2 border-b last:border-b-0">
                                        <span class="text-gray-700">{{ lesson.order }}. {{ lesson.title }}</span>
                                        <NuxtLink :to="`/learn/lesson/${lesson.id}`"
                                            class="text-indigo-600 hover:underline text-sm font-semibold">
                                            Mulai
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </details>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>