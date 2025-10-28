import { readBody } from 'h3'
import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const courseId = event.context.params?.id
        const body = await readBody(event)

        if (!courseId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID Kursus tidak ditemukan',
            })
        }

        const updatedCourse = await db.course.update({
            where: { id: courseId },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                category: body.category,
                level: body.level,
                imageUrl: body.imageUrl,
            },
        })

        return {
            message: 'Kursus berhasil diperbarui',
            course: updatedCourse,
        }
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal memperbarui kursus',
        })
    }
})