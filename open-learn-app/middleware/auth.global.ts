import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    const protectedRoutes = ['/me', '/learn']

    const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))

    if (isProtectedRoute && !authStore.isLoggedIn) {
        return navigateTo('/login')
    }

    if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
        return navigateTo('/me')
    }
})