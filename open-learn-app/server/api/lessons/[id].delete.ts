import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const lessonId = event.context.params?.id
        if (!lessonId) {
            throw createError({ statusCode: 400, statusMessage: 'ID Pelajaran tidak ditemukan.' })
        }
        await db.lesson.delete({ where: { id: lessonId } })
        setResponseStatus(event, 204)
        return
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal menghapus pelajaran.' })
    }
})