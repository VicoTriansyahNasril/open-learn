// FILE: Open-Learn/admin-dashboard/src/app/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/app/layouts/AdminLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Courses from '@/pages/Courses.vue'
import CourseDetail from '@/pages/CourseDetail.vue'
import Users from '@/pages/Users.vue'
import Questions from '@/pages/Questions.vue'
import Login from '@/pages/Login.vue'
import api from '@/shared/api'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'courses', name: 'Courses', component: Courses },
      { path: 'courses/:id', name: 'CourseDetail', component: CourseDetail },
      { path: 'users', name: 'Users', component: Users },
      { path: 'questions', name: 'Questions', component: Questions }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const needsAuth = to.matched.some(record => record.meta.requiresAuth);

  if (needsAuth) {
    try {
      const response = await api.get('/auth/me');

      if (response.data.role !== 'ADMIN') {
        next({ name: 'Login' });
        return;
      }

      next();
    } catch (error) {
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router