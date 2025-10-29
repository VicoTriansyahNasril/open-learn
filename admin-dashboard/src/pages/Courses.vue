<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/shared/api'
import BaseModal from '@/shared/ui/BaseModal.vue'
import CourseForm from '@/features/course/CourseForm.vue'
import notifier from '@/shared/utils/notifier'

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    imageUrl: string;
    publishedAt: string | null;
}

const courses = ref<Course[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const editingCourse = ref<Course | undefined>(undefined)

async function fetchCourses() {
    try {
        isLoading.value = true
        const response = await api.get<Course[]>('/courses')
        courses.value = response.data
    } catch (err) {
        error.value = 'Gagal mengambil data kursus.'
    } finally {
        isLoading.value = false
    }
}

function openCreateModal() {
    editingCourse.value = undefined
    isModalOpen.value = true
}

function openEditModal(course: Course) {
    editingCourse.value = { ...course }
    isModalOpen.value = true
}

function handleSuccess(updatedOrNewCourse: Course) {
    const isEditing = !!editingCourse.value
    if (isEditing) {
        const index = courses.value.findIndex(c => c.id === updatedOrNewCourse.id)
        if (index !== -1) {
            courses.value[index] = updatedOrNewCourse
        }
    } else {
        courses.value.push(updatedOrNewCourse)
    }
    isModalOpen.value = false
    notifier.success(isEditing ? 'Kursus berhasil diperbarui!' : 'Kursus berhasil dibuat!')
}

async function deleteCourse(course: Course) {
    const result = await notifier.confirm(
        'Hapus Kursus?',
        `Apakah Anda yakin ingin menghapus kursus "${course.title}"? Aksi ini tidak dapat dibatalkan.`
    )
    
    if (result.isConfirmed) {
        try {
            await api.delete(`/courses/${course.id}`)
            courses.value = courses.value.filter(c => c.id !== course.id)
            notifier.success('Kursus berhasil dihapus.')
        } catch (err) {
            notifier.error('Gagal menghapus kursus.')
        }
    }
}

onMounted(fetchCourses)
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-800">Manajemen Kursus</h1>
            <button @click="openCreateModal" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                + Tambah Kursus
            </button>
        </div>

        <div class="bg-white shadow rounded-lg overflow-x-auto">
            <div v-if="isLoading" class="p-6 text-center">Memuat data...</div>
            <div v-else-if="error" class="p-6 text-center text-red-500">{{ error }}</div>
            <table v-else class="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th
                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Judul
                        </th>
                        <th
                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Kategori
                        </th>
                        <th
                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Level
                        </th>
                        <th
                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="course in courses" :key="course.id">
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <RouterLink :to="`/courses/${course.id}`"
                                class="text-indigo-600 hover:text-indigo-900 font-semibold">
                                {{ course.title }}
                            </RouterLink>
                        </td>
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-gray-900 whitespace-no-wrap">{{ course.category }}</p>
                        </td>
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span aria-hidden class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                <span class="relative capitalize">{{ course.level }}</span>
                            </span>
                        </td>
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-gray-900 whitespace-no-wrap">
                                {{ course.publishedAt ? 'Published' : 'Draft' }}
                            </p>
                        </td>
                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right space-x-3">
                            <button @click="openEditModal(course)"
                                class="text-indigo-600 hover:text-indigo-900">Edit</button>
                            <button @click="deleteCourse(course)" class="text-red-600 hover:text-red-900">Hapus</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <BaseModal v-model="isModalOpen">
            <template #header>
                <h2 class="text-lg font-semibold">{{ editingCourse ? 'Edit Kursus' : 'Tambah Kursus Baru' }}</h2>
            </template>
            <CourseForm :initial-data="editingCourse" @cancel="isModalOpen = false" @success="handleSuccess" />
        </BaseModal>
    </div>
</template>