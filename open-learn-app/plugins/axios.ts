import axios from 'axios'
import { defineNuxtPlugin } from 'nuxt/app'
import { useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = axios.create({
        baseURL: config.public.apiBaseUrl as string | undefined,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return {
        provide: {
            api: api,
        },
    }
})