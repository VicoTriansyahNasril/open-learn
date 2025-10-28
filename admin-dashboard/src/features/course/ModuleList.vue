<script setup lang="ts">
import { ref } from 'vue';
import api from '@/shared/api';
import BaseModal from '@/shared/ui/BaseModal.vue';
import LessonForm from '@/features/lesson/LessonForm.vue';

interface Lesson {
    id: string;
    title: string;
    order: number;
    content?: string;
}

interface Module {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

const props = defineProps<{
    initialModules: Module[];
    courseId: string;
}>();

const modules = ref<Module[]>(props.initialModules);
const newModuleTitle = ref('');
const isAddingModule = ref(false);

const isLessonModalOpen = ref(false);
const selectedModuleId = ref<string | null>(null);
const editingLesson = ref<Lesson | null>(null);

const isEditModuleModalOpen = ref(false);
const editingModule = ref<Module | null>(null);
const editModuleTitle = ref('');

async function addModule() {
    if (!newModuleTitle.value.trim()) return;
    isAddingModule.value = true;
    try {
        const response = await api.post<Module>('/modules', {
            title: newModuleTitle.value,
            courseId: props.courseId,
        });
        modules.value.push({ ...response.data, lessons: [] });
        newModuleTitle.value = '';
    } catch (error) {
        alert('Gagal menambah modul.');
    } finally {
        isAddingModule.value = false;
    }
}

function openEditModuleModal(module: Module) {
    editingModule.value = module;
    editModuleTitle.value = module.title;
    isEditModuleModalOpen.value = true;
}

async function handleUpdateModule() {
    if (!editingModule.value || !editModuleTitle.value.trim()) return;
    try {
        await api.put(`/modules/${editingModule.value.id}`, { title: editModuleTitle.value });
        const moduleIndex = modules.value.findIndex(m => m.id === editingModule.value!.id);
        if (moduleIndex !== -1) {
            modules.value[moduleIndex].title = editModuleTitle.value;
        }
        isEditModuleModalOpen.value = false;
    } catch (error) {
        alert('Gagal memperbarui modul.');
    }
}

async function deleteModule(moduleId: string) {
    if (!window.confirm('Yakin ingin menghapus modul ini? Semua pelajaran di dalamnya akan ikut terhapus.')) return;
    try {
        await api.delete(`/modules/${moduleId}`);
        modules.value = modules.value.filter(m => m.id !== moduleId);
    } catch (error) {
        alert('Gagal menghapus modul.');
    }
}

function openCreateLessonModal(moduleId: string) {
    selectedModuleId.value = moduleId;
    editingLesson.value = null;
    isLessonModalOpen.value = true;
}

function openEditLessonModal(lesson: Lesson, moduleId: string) {
    selectedModuleId.value = moduleId;
    editingLesson.value = { ...lesson };
    isLessonModalOpen.value = true;
}

function handleLessonSuccess(newOrUpdatedLesson: Lesson) {
    const moduleIndex = modules.value.findIndex(m => m.id === selectedModuleId.value);
    if (moduleIndex === -1) return;

    const module = modules.value[moduleIndex];
    if (editingLesson.value) {
        const lessonIndex = module.lessons.findIndex(l => l.id === newOrUpdatedLesson.id);
        if (lessonIndex !== -1) {
            module.lessons[lessonIndex] = newOrUpdatedLesson;
        }
    } else {
        module.lessons.push(newOrUpdatedLesson);
    }
    isLessonModalOpen.value = false;
}

async function deleteLesson(lesson: Lesson, moduleId: string) {
    if (!window.confirm(`Yakin ingin menghapus pelajaran "${lesson.title}"?`)) return;

    try {
        await api.delete(`/lessons/${lesson.id}`);
        const moduleIndex = modules.value.findIndex(m => m.id === moduleId);
        if (moduleIndex !== -1) {
            modules.value[moduleIndex].lessons = modules.value[moduleIndex].lessons.filter(l => l.id !== lesson.id);
        }
    } catch (error) {
        alert('Gagal menghapus pelajaran.');
    }
}
</script>

<template>
    <div class="space-y-6">
        <div v-for="module in modules" :key="module.id" class="bg-gray-50 p-4 rounded-lg border">
            <div class="flex justify-between items-center">
                <h3 class="font-semibold text-lg">{{ module.order }}. {{ module.title }}</h3>
                <div class="space-x-2">
                    <button @click="openEditModuleModal(module)"
                        class="text-sm text-indigo-600 hover:underline">Edit</button>
                    <button @click="deleteModule(module.id)" class="text-sm text-red-600 hover:underline">Hapus</button>
                </div>
            </div>

            <div class="mt-4 pl-4 border-l-2 space-y-2">
                <div v-for="lesson in module.lessons" :key="lesson.id"
                    class="flex justify-between items-center p-2 rounded hover:bg-gray-100">
                    <p class="text-sm">{{ lesson.order }}. {{ lesson.title }}</p>
                    <div class="space-x-2">
                        <button @click="openEditLessonModal(lesson, module.id)"
                            class="text-sm text-blue-600 hover:underline">Edit</button>
                        <button @click="deleteLesson(lesson, module.id)"
                            class="text-sm text-red-600 hover:underline">Hapus</button>
                    </div>
                </div>
                <button @click="openCreateLessonModal(module.id)"
                    class="text-sm font-semibold text-indigo-600 hover:text-indigo-800 mt-2">+ Tambah Pelajaran</button>
            </div>
        </div>

        <div class="pt-4">
            <form @submit.prevent="addModule">
                <label for="new-module" class="block text-sm font-medium text-gray-700">Tambah Modul Baru</label>
                <div class="mt-1 flex rounded-md shadow-sm">
                    <input v-model="newModuleTitle" type="text" id="new-module"
                        class="flex-1 block w-full rounded-none rounded-l-md border-gray-300 p-2"
                        placeholder="Judul Modul" />
                    <button type="submit" :disabled="isAddingModule"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
                        {{ isAddingModule ? '...' : 'Tambah' }}
                    </button>
                </div>
            </form>
        </div>

        <BaseModal v-model="isEditModuleModalOpen">
            <template #header>
                <h2 class="text-lg font-semibold">Edit Judul Modul</h2>
            </template>
            <form @submit.prevent="handleUpdateModule">
                <input v-model="editModuleTitle" type="text" class="w-full border border-gray-300 rounded-md p-2"
                    required>
                <div class="mt-4 flex justify-end space-x-2">
                    <button type="button" @click="isEditModuleModalOpen = false"
                        class="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Simpan</button>
                </div>
            </form>
        </BaseModal>

        <BaseModal v-model="isLessonModalOpen">
            <template #header>
                <h2 class="text-lg font-semibold">{{ editingLesson ? 'Edit Pelajaran' : 'Tambah Pelajaran Baru' }}</h2>
            </template>
            <LessonForm v-if="selectedModuleId" :module-id="selectedModuleId" :initial-data="editingLesson"
                @cancel="isLessonModalOpen = false" @success="handleLessonSuccess" />
        </BaseModal>
    </div>
</template>