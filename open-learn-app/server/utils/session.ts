import { H3Event } from 'h3'

export async function requireUserSession(event: H3Event) {
    const config = useRuntimeConfig(event)
    const session = await useSession(event, { password: config.sessionPassword })

    if (!session.data?.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized. Anda harus login untuk mengakses sumber daya ini.',
        })
    }

    return session.data.user
}