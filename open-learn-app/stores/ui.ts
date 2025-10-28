import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
    state: () => ({
        isSidebarOpen: false,
        isDarkMode: false,
    }),
    actions: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen
        },
        setDarkMode(payload: boolean) {
            this.isDarkMode = payload
        },
    },
})