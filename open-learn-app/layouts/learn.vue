<script setup lang="ts">
interface LessonInfo {
    id: string;
    title: string;
    order: number;
    progress: any[];
}
interface ModuleInfo {
    id: string;
    title: string;
    order: number;
    lessons: LessonInfo[];
}
interface CourseInfo {
    id: string;
    title: string;
    slug: string;
    modules: ModuleInfo[];
}

defineProps<{
    course: CourseInfo | null,
    currentLessonId: string | null,
}>();
</script>

<template>
    <div class="flex h-screen bg-gray-100 font-sans">
        <aside v-if="course" class="w-80 bg-white shadow-md flex flex-col">
            <header class="p-4 border-b">
                <NuxtLink :to="`/courses/${course.slug}`" class="text-sm text-indigo-600 hover:underline">&larr; Kembali
                    ke Detail</NuxtLink>
                <h1 class="mt-2 text-xl font-bold text-gray-800">{{ course.title }}</h1>
            </header>
            <nav class="flex-1 overflow-y-auto">
                <div v-for="module in course.modules" :key="module.id" class="border-b">
                    <h2 class="p-4 font-semibold text-gray-700">{{ module.order }}. {{ module.title }}</h2>
                    <ul>
                        <li v-for="lesson in module.lessons" :key="lesson.id">
                            <NuxtLink :to="`/learn/lesson/${lesson.id}`"
                                class="flex items-center px-6 py-3 text-sm hover:bg-gray-50" :class="{
                                    'bg-indigo-50 text-indigo-700 font-semibold': lesson.id === currentLessonId,
                                    'text-gray-600': lesson.id !== currentLessonId,
                                    'line-through text-gray-400': lesson.progress && lesson.progress.length > 0
                                }">
                                <span
                                    class="mr-3 h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0"
                                    :class="{ 'bg-green-500 border-green-500': lesson.progress && lesson.progress.length > 0 }">
                                    <span v-if="lesson.progress && lesson.progress.length > 0"
                                        class="text-white">&#10003;</span>
                                </span>
                                {{ lesson.order }}. {{ lesson.title }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>

        <main class="flex-1 flex flex-col">
            <slot />
        </main>
    </div>
</template>