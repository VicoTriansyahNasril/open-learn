import { defineStore } from 'pinia'

interface User {
    id: string
    name: string
    email: string
    role: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.user,
        isAdmin: (state) => state.user?.role === 'ADMIN',
    },
    actions: {
        setUser(user: User | null) {
            this.user = user
        },
    },
})