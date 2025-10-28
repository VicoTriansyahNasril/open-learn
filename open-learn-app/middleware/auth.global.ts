import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (to.path.startsWith('/learn') && authStore.user?.role !== 'STUDENT') {
        return abortNavigation({
            statusCode: 403,
            statusMessage: 'Forbidden: Hanya siswa yang dapat mengakses halaman ini.',
        })
    }

    if (to.path.startsWith('/me') && !authStore.isLoggedIn) {
        return navigateTo('/login')
    }

    if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
        return navigateTo('/me')
    }
})