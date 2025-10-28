import db from '~/server/utils/db'
import { requireUserSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
    const user = await requireUserSession(event)
    if (user.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const questionId = event.context.params?.id
    if (!questionId) {
        throw createError({ statusCode: 400, statusMessage: 'ID Soal tidak ditemukan.' })
    }

    try {
        await db.question.delete({
            where: { id: questionId },
        })
        setResponseStatus(event, 204)
        return
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal menghapus soal.' })
    }
})