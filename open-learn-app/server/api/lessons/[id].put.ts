import { readBody } from 'h3'
import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const lessonId = event.context.params?.id
        const { title, content } = await readBody(event)

        if (!lessonId) {
            throw createError({ statusCode: 400, statusMessage: 'ID Pelajaran tidak ditemukan.' })
        }

        return db.lesson.update({
            where: { id: lessonId },
            data: { title, content },
        })
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal memperbarui pelajaran.' })
    }
})