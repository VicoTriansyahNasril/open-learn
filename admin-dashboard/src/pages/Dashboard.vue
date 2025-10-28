<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/shared/api';

interface KpiData {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalEnrollments: number;
}

const kpi = ref<KpiData | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get<KpiData>('/stats/kpi');
    kpi.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data KPI", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
    <div v-if="isLoading" class="text-center">
      Memuat data statistik...
    </div>
    <div v-else-if="kpi" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card Total Pengguna -->
      <div class="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
        <div class="flex items-center">
          <div class="p-3 bg-indigo-500 text-white rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.286-2.143m-3.286 2.143L3 11m0 0a3.002 3.002 0 013.286-2.143m0 0L7 4m-4 7h14m-5 3v2m0 0v2m0-2h2m-2 0h-2">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 uppercase">Total Pengguna</p>
            <p class="text-2xl font-bold text-gray-900">{{ kpi.totalUsers }}</p>
          </div>
        </div>
      </div>

      <!-- Card Total Kursus -->
      <div class="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
        <div class="flex items-center">
          <div class="p-3 bg-green-500 text-white rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 uppercase">Total Kursus</p>
            <p class="text-2xl font-bold text-gray-900">{{ kpi.totalCourses }}</p>
          </div>
        </div>
      </div>

      <!-- Card Total Pelajaran -->
      <div class="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-500 text-white rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5V3a2 2 0 012-2h2a2 2 0 012 2v2">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 uppercase">Total Pelajaran</p>
            <p class="text-2xl font-bold text-gray-900">{{ kpi.totalLessons }}</p>
          </div>
        </div>
      </div>

      <!-- Card Total Pendaftaran (Enrollment) -->
      <div class="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
        <div class="flex items-center">
          <div class="p-3 bg-red-500 text-white rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 uppercase">Penyelesaian</p>
            <p class="text-2xl font-bold text-gray-900">{{ kpi.totalEnrollments }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>