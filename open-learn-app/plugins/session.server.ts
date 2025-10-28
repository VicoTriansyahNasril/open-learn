import { useAuthStore } from '~/stores/auth'
import { defineNuxtPlugin } from '#app'
import type { Pinia } from 'pinia'
import { useSession } from 'h3'

export default defineNuxtPlugin(async (nuxtApp) => {
    if (!nuxtApp.ssrContext) {
        return
    }

    const authStore = useAuthStore(nuxtApp.$pinia as Pinia)
    const config = useRuntimeConfig()

    const session = await useSession(nuxtApp.ssrContext.event, { password: config.sessionPassword })

    if (session.data?.user) {
        authStore.setUser(session.data.user)
    }
})