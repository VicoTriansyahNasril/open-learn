import db from '~/server/utils/db'
import { requireUserSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
    const user = await requireUserSession(event)
    if (user.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    try {
        const quizzes = await db.quiz.findMany({
            include: {
                _count: {
                    select: { items: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return quizzes
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil data kuis.' })
    }
})