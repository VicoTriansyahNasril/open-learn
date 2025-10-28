import { readBody } from 'h3'
import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const { lessonId } = await readBody(event)
        const userId = 'user_dummy_123'

        if (!lessonId) {
            throw createError({ statusCode: 400, statusMessage: 'ID Pelajaran dibutuhkan.' })
        }

        const existingProgress = await db.lessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
        })

        if (existingProgress) {
            return existingProgress
        }

        const newProgress = await db.lessonProgress.create({
            data: {
                userId,
                lessonId,
            },
        })

        setResponseStatus(event, 201)
        return newProgress

    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal menyimpan progres.' })
    }
})