import { readBody } from 'h3'
import db from '~/server/utils/db'
import { requireUserSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
    const user = await requireUserSession(event)
    if (user.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    try {
        const body = await readBody(event)
        const { text, type, difficulty, options } = body

        if (!text || !type || !options || !Array.isArray(options) || options.length === 0) {
            throw createError({ statusCode: 400, statusMessage: 'Data soal tidak lengkap.' })
        }

        const newQuestion = await db.question.create({
            data: {
                text,
                type,
                difficulty: difficulty || 'medium',
                options: {
                    create: options.map((opt: { text: string, isCorrect: boolean }) => ({
                        text: opt.text,
                        isCorrect: opt.isCorrect,
                    })),
                },
            },
            include: {
                options: true,
            },
        })

        setResponseStatus(event, 201)
        return newQuestion
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal membuat soal baru.' })
    }
})