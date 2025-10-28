<script setup lang="ts">
import type { LessonApiResponse, ProgressResponse, Badge } from '~/types';

definePageMeta({
    layout: false,
});

const route = useRoute();
const lessonId = computed(() => {
    const param = route.params.id;
    return Array.isArray(param) ? param[0] : param;
});

const asyncDataKey = computed(() => `lesson-data-${lessonId.value}`);

const { data, pending, error, refresh } = await useAsyncData<LessonApiResponse | null>(
    asyncDataKey.value,
    () => {
        if (!lessonId.value) {
            return Promise.resolve(null);
        }
        const apiUrl = `/api/lessons/${lessonId.value}`;
        return $fetch(apiUrl);
    },
    {
        watch: [lessonId]
    }
);

const lesson = computed(() => data.value?.lesson);
const course = computed(() => data.value?.course);

const isCompleting = ref(false);

async function markAsComplete() {
    if (!lessonId.value) return;

    isCompleting.value = true;

    const apiUrl = '/api/progress';
    const { data: response, error: completeError } = await useFetch<ProgressResponse>(apiUrl, {
        method: 'POST',
        body: { lessonId: lessonId.value },
        key: `complete-lesson-${lessonId.value}-${Date.now()}`,
    });

    isCompleting.value = false;

    if (completeError.value) {
        console.error("Gagal menandai selesai", completeError.value);
        alert('Gagal menyimpan progres.');
        return;
    }

    if (response.value?.awardedBadges && response.value.awardedBadges.length > 0) {
        const badgeNames = response.value.awardedBadges.map((b: Badge) => b.name).join(', ');
        alert(`Selamat! Anda mendapatkan badge baru: ${badgeNames}`);
    }

    await refresh();
}

useSeoMeta({
    title: () => lesson.value?.title || 'Belajar',
});
</script>

<template>
    <div>
        <NuxtLayout name="learn" :course="course" :current-lesson-id="lessonId">
            <div v-if="pending" class="flex items-center justify-center h-full">
                Memuat pelajaran...
            </div>
            <div v-else-if="error || !lesson" class="flex items-center justify-center h-full text-red-500">
                Gagal memuat pelajaran.
            </div>
            <div v-else class="flex flex-col h-full bg-white">
                <header class="bg-white p-6 border-b flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800">{{ lesson.title }}</h1>
                    <div>
                        <button @click="markAsComplete" :disabled="isCompleting"
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                            {{ isCompleting ? 'Menyimpan...' : 'Tandai Selesai' }}
                        </button>
                    </div>
                </header>
                <div class="flex-1 p-8 overflow-y-auto">
                    <div class="prose lg:prose-xl max-w-none">
                        <p v-if="!lesson.content" class="italic text-gray-500">Konten untuk pelajaran ini belum
                            tersedia.</p>
                        <div v-else v-html="lesson.content"></div>
                    </div>
                </div>
            </div>
        </NuxtLayout>
    </div>
</template>