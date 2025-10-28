import axios from 'axios'

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null
    }
    return null
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const protectedMethods = ['post', 'put', 'delete', 'patch']
    const method = config.method?.toLowerCase()

    if (method && protectedMethods.includes(method)) {
        const csrfToken = getCookie('__Host-csrf-token')
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken
        } else {
            console.warn('CSRF token cookie not found. Request might be rejected by the server.')
        }
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

export default api