<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/shared/api'

interface CourseData {
    id?: string;
    title: string;
    slug: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    imageUrl: string;
}

const props = defineProps<{
    initialData?: CourseData | null;
}>()

const emit = defineEmits(['success', 'cancel'])

const form = ref<Omit<CourseData, 'id'>>({
    title: '',
    slug: '',
    description: '',
    level: 'beginner',
    category: '',
    imageUrl: '',
})

const isLoading = ref(false)
const errorMessage = ref('')
const isSlugManuallyChanged = ref<boolean>(false)

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

watch(() => props.initialData, (newData) => {
    if (newData) {
        form.value = { ...newData }
        isSlugManuallyChanged.value = !!newData.slug;
    } else {
        form.value = { title: '', slug: '', description: '', level: 'beginner', category: '', imageUrl: '' }
        isSlugManuallyChanged.value = false;
    }
}, { immediate: true });

watch(() => form.value.title, (newTitle, oldTitle) => {
    const oldTitleSlug = generateSlug(oldTitle || '')
    if (!isSlugManuallyChanged.value && (!form.value.slug || form.value.slug === oldTitleSlug)) {
        form.value.slug = generateSlug(newTitle)
    }
})

async function handleSubmit() {
    if (!form.value.title || !form.value.category) {
        errorMessage.value = 'Judul dan Kategori wajib diisi.'
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        let response;
        if (props.initialData?.id) {
            response = await api.put(`/courses/${props.initialData.id}`, form.value)
        } else {
            response = await api.post('/courses', form.value)
        }
        emit('success', response.data.course)
    } catch (error) {
        errorMessage.value = 'Terjadi kesalahan saat menyimpan data.'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
            <div>
                <label for="title" class="block text-sm font-medium text-gray-700">Judul Kursus</label>
                <input v-model="form.title" type="text" id="title"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
            </div>
            <div>
                <label for="slug" class="block text-sm font-medium text-gray-700">Slug</label>
                <input v-model="form.slug" @input="isSlugManuallyChanged = true" type="text" id="slug"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea v-model="form.description" id="description" rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
            <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Kategori</label>
                <input v-model="form.category" type="text" id="category"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
            </div>
            <div>
                <label for="level" class="block text-sm font-medium text-gray-700">Level</label>
                <select v-model="form.level" id="level"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>
            <div>
                <label for="imageUrl" class="block text-sm font-medium text-gray-700">URL Gambar</label>
                <input v-model="form.imageUrl" type="text" id="imageUrl"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div v-if="errorMessage" class="text-red-500 text-sm">
                {{ errorMessage }}
            </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="$emit('cancel')"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Batal
            </button>
            <button type="submit" :disabled="isLoading"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
        </div>
    </form>
</template>