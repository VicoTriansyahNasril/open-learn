import { readBody } from 'h3'
import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        const { title, courseId } = body

        if (!title || !courseId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Judul modul dan ID kursus dibutuhkan.',
            })
        }

        // Cari modul dengan urutan tertinggi untuk kursus ini
        const lastModule = await db.module.findFirst({
            where: { courseId },
            orderBy: { order: 'desc' },
        })

        const newOrder = lastModule ? lastModule.order + 1 : 1

        const newModule = await db.module.create({
            data: {
                title,
                courseId,
                order: newOrder,
            },
        })

        setResponseStatus(event, 201)
        return newModule

    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal membuat modul baru.',
        })
    }
})