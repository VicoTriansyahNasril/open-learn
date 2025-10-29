<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/shared/api'
import BaseModal from '@/shared/ui/BaseModal.vue'
import QuestionForm from '@/features/question/QuestionForm.vue'
import type { Question } from '@/shared/types/question'
import notifier from '@/shared/utils/notifier'

const questions = ref<Question[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const editingQuestion = ref<Question | undefined>(undefined)

async function fetchQuestions() {
    try {
        isLoading.value = true
        const response = await api.get<Question[]>('/questions')
        questions.value = response.data
    } catch (err) {
        error.value = 'Gagal mengambil data soal.'
    } finally {
        isLoading.value = false
    }
}

function openCreateModal() {
    editingQuestion.value = undefined
    isModalOpen.value = true
}

function openEditModal(question: Question) {
    editingQuestion.value = { ...question }
    isModalOpen.value = true
}

function handleSuccess(updatedOrNewQuestion: Question) {
    const isEditing = !!editingQuestion.value
    if (isEditing) {
        const index = questions.value.findIndex(q => q.id === updatedOrNewQuestion.id)
        if (index !== -1) {
            questions.value[index] = updatedOrNewQuestion
        }
    } else {
        questions.value.unshift(updatedOrNewQuestion)
    }
    isModalOpen.value = false
    notifier.success(isEditing ? 'Soal berhasil diperbarui!' : 'Soal berhasil dibuat!')
}

async function deleteQuestion(question: Question) {
    const result = await notifier.confirm(
        'Hapus Soal?',
        'Apakah Anda yakin ingin menghapus soal ini?',
    )

    if (result.isConfirmed) {
        try {
            await api.delete(`/questions/${question.id}`)
            questions.value = questions.value.filter(q => q.id !== question.id)
            notifier.success('Soal berhasil dihapus.')
        } catch (err) {
            notifier.error('Gagal menghapus soal.')
        }
    }
}

onMounted(fetchQuestions)
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-800">Bank Soal</h1>
            <button @click="openCreateModal"
                class="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 transition-all duration-200">
                + Tambah Soal
            </button>
        </div>

        <div v-if="isLoading" class="text-center p-10">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p class="mt-4 text-gray-600">Memuat soal...</p>
        </div>
        <div v-else-if="error" class="p-6 text-center bg-red-50 text-red-600 rounded-lg">{{ error }}</div>
        <div v-else-if="questions.length === 0" class="text-center p-10 bg-white rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-800">Belum Ada Soal</h3>
            <p class="mt-2 text-sm text-gray-500">Mulai dengan menambahkan soal baru ke dalam bank soal.</p>
        </div>
        <div v-else class="space-y-4">
            <div v-for="question in questions" :key="question.id"
                class="bg-white p-5 rounded-lg shadow-md border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-xl hover:border-indigo-600">
                <div class="flex justify-between items-start">
                    <p class="text-gray-800 flex-1 pr-4">{{ question.text }}</p>
                    <div class="flex-shrink-0 flex space-x-2">
                        <button @click="openEditModal(question)"
                            class="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button @click="deleteQuestion(question)"
                            class="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <div v-for="option in question.options" :key="option.id" class="flex items-center text-sm mb-2"
                        :class="option.isCorrect ? 'font-semibold text-green-700' : 'text-gray-600'">
                        <svg class="w-5 h-5 mr-2 flex-shrink-0" :class="option.isCorrect ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        {{ option.text }}
                    </div>
                </div>
            </div>
        </div>

        <BaseModal v-model="isModalOpen">
            <template #header>
                <h2 class="text-xl font-bold text-gray-800">{{ editingQuestion ? 'Edit Soal' : 'Tambah Soal Baru' }}</h2>
            </template>
            <QuestionForm :initial-data="editingQuestion" @cancel="isModalOpen = false" @success="handleSuccess" />
        </BaseModal>
    </div>
</template>