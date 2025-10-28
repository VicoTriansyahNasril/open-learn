<script setup lang="ts">
definePageMeta({
    layout: false,
});

const route = useRoute();
const lessonId = computed(() => {
    const param = route.params.id;
    return Array.isArray(param) ? param : param;
});

const { data, pending, error, refresh } = await useAsyncData(
    'lessonData',
    () => {
        if (!lessonId.value) return Promise.resolve(null);
        return $fetch(`/api/lessons/${lessonId.value}`);
    },
    { watch: [lessonId] }
);

const lesson = computed(() => data.value?.lesson);
const course = computed(() => data.value?.course);

const isCompleting = ref(false);

async function markAsComplete() {
    if (!lessonId.value) return;
    isCompleting.value = true;
    try {
        await $fetch('/api/progress', {
            method: 'POST',
            body: { lessonId: lessonId.value }
        });
        await refresh();
    } catch (err) {
        console.error("Gagal menandai selesai", err);
        alert('Gagal menyimpan progres.');
    } finally {
        isCompleting.value = false;
    }
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