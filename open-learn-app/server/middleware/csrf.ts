import { createCsrfTokenAndSetCookie, verifyCsrfToken } from '~/server/utils/csrf'

const PROTECTED_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH']
const EXEMPTED_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/logout']

export default defineEventHandler(async (event) => {
    const isSessionAvailable = !!event.context.sessions
    if (isSessionAvailable) {
        const csrfToken = getCookie(event, '__Host-csrf-token')
        if (!csrfToken) {
            createCsrfTokenAndSetCookie(event)
        }
    }

    const requestPath = getRequestPath(event)
    if (EXEMPTED_PATHS.includes(requestPath)) {
        return
    }

    if (PROTECTED_METHODS.includes(event.method)) {
        const isVerified = verifyCsrfToken(event)
        if (!isVerified) {
            throw createError({
                statusCode: 403,
                statusMessage: 'CSRF token mismatch. Silakan muat ulang halaman dan coba lagi.',
            })
        }
    }
})