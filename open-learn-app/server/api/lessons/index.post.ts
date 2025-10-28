import { readBody } from 'h3'
import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const { title, moduleId, content } = await readBody(event)
        if (!title || !moduleId) {
            throw createError({ statusCode: 400, statusMessage: 'Judul dan ID Modul dibutuhkan.' })
        }

        const lastLesson = await db.lesson.findFirst({
            where: { moduleId },
            orderBy: { order: 'desc' },
        })

        const newOrder = lastLesson ? lastLesson.order + 1 : 1

        const newLesson = await db.lesson.create({
            data: {
                title,
                moduleId,
                order: newOrder,
                content: content || '',
            },
        })

        setResponseStatus(event, 201)
        return newLesson

    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal membuat pelajaran baru.' })
    }
})