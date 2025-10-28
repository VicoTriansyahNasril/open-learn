import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const courseId = event.context.params?.id

        if (!courseId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID Kursus tidak ditemukan',
            })
        }

        await db.course.delete({
            where: { id: courseId },
        })

        setResponseStatus(event, 204)
        return
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal menghapus kursus',
        })
    }
})