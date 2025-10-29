<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/shared/api'
import type { Question } from '@/shared/types/question'

const props = defineProps<{
    initialData?: Question | null;
}>()

const emit = defineEmits(['success', 'cancel'])

const form = ref<Omit<Question, 'id'>>({
    text: '',
    type: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }],
})

const isLoading = ref(false)
const errorMessage = ref('')

watch(() => props.initialData, (newData) => {
    if (newData) {
        form.value = JSON.parse(JSON.stringify(newData))
    } else {
        form.value = {
            text: '',
            type: 'MULTIPLE_CHOICE',
            difficulty: 'medium',
            options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }],
        }
    }
}, { immediate: true, deep: true });

function addOption() {
    form.value.options.push({ text: '', isCorrect: false })
}

function removeOption(index: number) {
    if (form.value.options.length > 2) {
        form.value.options.splice(index, 1)
    }
}

function setCorrectOption(selectedIndex: number) {
    form.value.options.forEach((option, index) => {
        option.isCorrect = index === selectedIndex
    })
}

async function handleSubmit() {
    isLoading.value = true
    errorMessage.value = ''
    try {
        const payload = {
            ...form.value,
            options: form.value.options.filter(opt => opt.text.trim() !== '')
        }
        
        if (payload.options.length < 2) {
            errorMessage.value = 'Minimal harus ada 2 pilihan jawaban.'
            isLoading.value = false
            return
        }
        if (!payload.options.some(opt => opt.isCorrect)) {
            errorMessage.value = 'Satu pilihan jawaban harus ditandai sebagai yang benar.'
            isLoading.value = false
            return
        }

        let response;
        if (props.initialData?.id) {
            response = await api.put(`/questions/${props.initialData.id}`, payload)
        } else {
            response = await api.post('/questions', payload)
        }
        emit('success', response.data)
    } catch (error) {
        errorMessage.value = 'Terjadi kesalahan saat menyimpan soal.'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
            <label for="question-text" class="block text-sm font-medium text-gray-700">Teks Soal</label>
            <textarea v-model="form.text" id="question-text" rows="4"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="question-type" class="block text-sm font-medium text-gray-700">Tipe</label>
                <select v-model="form.type" id="question-type"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                    <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
                </select>
            </div>
            <div>
                <label for="question-difficulty" class="block text-sm font-medium text-gray-700">Kesulitan</label>
                <select v-model="form.difficulty" id="question-difficulty"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                    <option value="easy">Mudah</option>
                    <option value="medium">Sedang</option>
                    <option value="hard">Sulit</option>
                </select>
            </div>
        </div>

        <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Pilihan Jawaban</h3>
            <div class="space-y-3">
                <div v-for="(option, index) in form.options" :key="index" class="flex items-center space-x-2">
                    <input type="radio" :name="'correct-option'" :checked="option.isCorrect"
                        @change="setCorrectOption(index)"
                        class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer">
                    <input v-model="option.text" type="text" :placeholder="`Pilihan ${index + 1}`"
                        class="flex-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                    <button type="button" @click="removeOption(index)"
                        :disabled="form.options.length <= 2"
                        class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <button type="button" @click="addOption"
                class="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                + Tambah Pilihan
            </button>
        </div>

        <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">
            {{ errorMessage }}
        </div>

        <div class="mt-8 flex justify-end space-x-3">
            <button type="button" @click="$emit('cancel')"
                class="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-transform transform hover:scale-105">
                Batal
            </button>
            <button type="submit" :disabled="isLoading"
                class="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center transition-transform transform hover:scale-105">
                <span v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
        </div>
    </form>
</template>