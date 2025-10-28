import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
    state: () => ({
        isSidebarOpen: true,
        isLoading: false,
    }),
    actions: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen
        },
        setLoading(payload: boolean) {
            this.isLoading = payload
        },
    },
})