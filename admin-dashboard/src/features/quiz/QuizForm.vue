<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/shared/api'
import type { Question } from '@/shared/types/question'

const emit = defineEmits(['success', 'cancel'])

const title = ref('')
const selectedQuestions = ref<string[]>([])
const allQuestions = ref<Question[]>([])
const isLoadingQuestions = ref(true)
const isLoadingSubmit = ref(false)
const errorMessage = ref('')

onMounted(async () => {
    try {
        const response = await api.get<Question[]>('/questions')
        allQuestions.value = response.data
    } catch (error) {
        errorMessage.value = 'Gagal memuat daftar soal.'
    } finally {
        isLoadingQuestions.value = false
    }
})

async function handleSubmit() {
    if (!title.value.trim() || selectedQuestions.value.length === 0) {
        errorMessage.value = 'Judul dan minimal satu soal harus dipilih.'
        return
    }

    isLoadingSubmit.value = true
    errorMessage.value = ''

    try {
        const response = await api.post('/quizzes', {
            title: title.value,
            questionIds: selectedQuestions.value,
        })
        emit('success', response.data)
    } catch (error) {
        errorMessage.value = 'Terjadi kesalahan saat membuat kuis.'
    } finally {
        isLoadingSubmit.value = false
    }
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
            <label for="quiz-title" class="block text-sm font-medium text-gray-700">Judul Kuis</label>
            <input v-model="title" type="text" id="quiz-title"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required>
        </div>

        <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Pilih Soal</h3>
            <div v-if="isLoadingQuestions" class="text-center py-4">Memuat soal...</div>
            <div v-else-if="allQuestions.length === 0" class="text-center py-4 text-gray-500">
                Bank soal masih kosong.
            </div>
            <div v-else class="max-h-80 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2 bg-gray-50">
                <label v-for="question in allQuestions" :key="question.id"
                    class="flex items-start p-3 rounded-md hover:bg-indigo-50 cursor-pointer transition-colors"
                    :class="{ 'bg-indigo-100 border-indigo-300 border': selectedQuestions.includes(question.id!) }">
                    <input type="checkbox" :value="question.id" v-model="selectedQuestions"
                        class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1">
                    <span class="ml-3 text-sm text-gray-800">{{ question.text }}</span>
                </label>
            </div>
        </div>

        <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">
            {{ errorMessage }}
        </div>

        <div class="mt-8 flex justify-end space-x-3">
            <button type="button" @click="$emit('cancel')"
                class="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-transform transform hover:scale-105">
                Batal
            </button>
            <button type="submit" :disabled="isLoadingSubmit || isLoadingQuestions"
                class="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center transition-transform transform hover:scale-105">
                <span v-if="isLoadingSubmit" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ isLoadingSubmit ? 'Membuat...' : 'Buat Kuis' }}
            </button>
        </div>
    </form>
</template>