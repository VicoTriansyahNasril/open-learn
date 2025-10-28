import db from '~/server/utils/db'
import { requireUserSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
    const user = await requireUserSession(event)

    if (user.role !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden. Hanya admin yang dapat mengakses sumber daya ini.',
        })
    }

    try {
        const users = await db.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                xp: true,
                level: true,
                createdAt: true,
            },
        })
        return users
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal mengambil data pengguna.',
        })
    }
})