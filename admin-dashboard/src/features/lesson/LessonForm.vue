<script setup lang="ts">
import { ref, watch } from 'vue';
import api from '@/shared/api';
import RichTextEditor from '@/shared/ui/RichTextEditor.vue';

interface LessonData {
    id?: string;
    title: string;
    content?: string;
}

const props = defineProps<{
    initialData?: LessonData | null; // Izinkan null
    moduleId: string;
}>();

const emit = defineEmits(['success', 'cancel']);

const form = ref<Omit<LessonData, 'id'>>({
    title: '',
    content: '',
});

const isLoading = ref(false);

// Ganti onMounted dengan watch
watch(() => props.initialData, (newData) => {
    if (newData) {
        form.value = { ...newData };
    } else {
        // Reset form jika tidak ada data (mode create)
        form.value = { title: '', content: '' };
    }
}, { immediate: true }); // immediate: true agar berjalan saat pertama kali komponen dibuat

async function handleSubmit() {
    isLoading.value = true;
    try {
        let response;
        if (props.initialData?.id) {
            response = await api.put(`/lessons/${props.initialData.id}`, form.value);
        } else {
            response = await api.post('/lessons', { ...form.value, moduleId: props.moduleId });
        }
        emit('success', response.data);
    } catch (error) {
        alert('Gagal menyimpan pelajaran.');
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
            <div>
                <label for="lesson-title" class="block text-sm font-medium text-gray-700">Judul Pelajaran</label>
                <input v-model="form.title" type="text" id="lesson-title"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
            </div>
            <div>
                <label for="lesson-content" class="block text-sm font-medium text-gray-700">Konten</label>
                <RichTextEditor v-model="form.content" class="mt-1" />
            </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="$emit('cancel')"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
            <button type="submit" :disabled="isLoading"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
        </div>
    </form>
</template>