<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/shared/api'
import BaseModal from '@/shared/ui/BaseModal.vue'
import QuizForm from '@/features/quiz/QuizForm.vue'

interface Quiz {
    id: string;
    title: string;
    mode: string;
    _count: {
        items: number;
    };
    createdAt: string;
}

const quizzes = ref<Quiz[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isModalOpen = ref(false)

async function fetchQuizzes() {
    isLoading.value = true
    try {
        const response = await api.get<Quiz[]>('/quizzes')
        quizzes.value = response.data
    } catch (err) {
        error.value = 'Gagal mengambil data kuis.'
    } finally {
        isLoading.value = false
    }
}

function handleSuccess(newQuiz: Quiz) {
    quizzes.value.unshift(newQuiz)
    isModalOpen.value = false
}

onMounted(fetchQuizzes)
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-800">Manajemen Kuis</h1>
            <button @click="isModalOpen = true"
                class="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 transition-all duration-200">
                + Buat Kuis Baru
            </button>
        </div>

        <div v-if="isLoading" class="text-center p-10">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p class="mt-4 text-gray-600">Memuat kuis...</p>
        </div>
        <div v-else-if="error" class="p-6 text-center bg-red-50 text-red-600 rounded-lg">{{ error }}</div>
        <div v-else-if="quizzes.length === 0" class="text-center p-10 bg-white rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-800">Belum Ada Kuis</h3>
            <p class="mt-2 text-sm text-gray-500">Mulai dengan membuat kuis baru.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="quiz in quizzes" :key="quiz.id"
                class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                <div class="p-6 flex-grow">
                    <h3 class="text-lg font-bold text-gray-900">{{ quiz.title }}</h3>
                    <p class="mt-2 text-sm text-gray-600">
                        Total Soal: <span class="font-semibold text-indigo-600">{{ quiz._count.items }}</span>
                    </p>
                </div>
                <div class="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2">
                    <button class="text-sm font-medium text-indigo-600 hover:text-indigo-800">Detail</button>
                    <button class="text-sm font-medium text-red-600 hover:text-red-800">Hapus</button>
                </div>
            </div>
        </div>

        <BaseModal v-model="isModalOpen">
            <template #header>
                <h2 class="text-xl font-bold text-gray-800">Buat Kuis Baru</h2>
            </template>
            <QuizForm @cancel="isModalOpen = false" @success="handleSuccess" />
        </BaseModal>
    </div>
</template>