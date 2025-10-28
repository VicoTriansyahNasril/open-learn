import { readBody } from 'h3'
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
        const { text, type, difficulty, options } = await readBody(event)

        if (!text || !type || !options || !Array.isArray(options)) {
            throw createError({ statusCode: 400, statusMessage: 'Data soal tidak lengkap.' })
        }

        const [, updatedQuestion] = await db.$transaction([
            db.option.deleteMany({ where: { questionId } }),
            db.question.update({
                where: { id: questionId },
                data: {
                    text,
                    type,
                    difficulty,
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
            }),
        ])

        return updatedQuestion
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal memperbarui soal.' })
    }
})