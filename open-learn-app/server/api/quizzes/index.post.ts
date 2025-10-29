import { readBody } from 'h3'
import db from '~/server/utils/db'
import { requireUserSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
    const user = await requireUserSession(event)
    if (user.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    try {
        const { title, questionIds } = await readBody(event)

        if (!title || !questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
            throw createError({ statusCode: 400, statusMessage: 'Judul dan minimal satu soal dibutuhkan.' })
        }

        const newQuiz = await db.quiz.create({
            data: {
                title,
                mode: 'ASSIGNED',
                items: {
                    create: questionIds.map((qId: string, index: number) => ({
                        questionId: qId,
                        order: index + 1,
                    })),
                },
            },
        })

        setResponseStatus(event, 201)
        return newQuiz
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal membuat kuis baru.' })
    }
})