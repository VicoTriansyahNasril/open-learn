import { H3Event } from 'h3'
import { randomBytes, timingSafeEqual } from 'crypto'

const CSRF_COOKIE_NAME = '__Host-csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_TOKEN_BYTE_LENGTH = 18

function generateCsrfToken(): string {
    return randomBytes(CSRF_TOKEN_BYTE_LENGTH).toString('base64url')
}

export function createCsrfTokenAndSetCookie(event: H3Event): string {
    const token = generateCsrfToken()
    setCookie(event, CSRF_COOKIE_NAME, token, {
        httpOnly: false,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })
    return token
}

export function verifyCsrfToken(event: H3Event): boolean {
    const tokenFromCookie = getCookie(event, CSRF_COOKIE_NAME)
    const tokenFromHeader = getRequestHeader(event, CSRF_HEADER_NAME)

    if (!tokenFromCookie || !tokenFromHeader) {
        return false
    }

    const bufferFromCookie = Buffer.from(tokenFromCookie, 'base64url')
    const bufferFromHeader = Buffer.from(tokenFromHeader, 'base64url')

    if (bufferFromCookie.length !== bufferFromHeader.length) {
        return false
    }

    return timingSafeEqual(bufferFromCookie, bufferFromHeader)
}