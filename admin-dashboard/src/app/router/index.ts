import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/app/layouts/AdminLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Courses from '@/pages/Courses.vue'
import CourseDetail from '@/pages/CourseDetail.vue'

const routes = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'courses',
        name: 'Courses',
        component: Courses,
      },
      { // <-- Tambahkan route baru ini
        path: 'courses/:id',
        name: 'CourseDetail',
        component: CourseDetail,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router