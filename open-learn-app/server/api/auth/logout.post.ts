import { createError, clearSession } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig(event)
        await clearSession(event, { password: config.sessionPassword })

        return { message: 'Logout berhasil' }
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Gagal untuk logout.' })
    }
})