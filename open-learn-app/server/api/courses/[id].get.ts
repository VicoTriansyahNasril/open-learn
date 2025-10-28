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

        const course = await db.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        })

        if (!course) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Kursus tidak ditemukan',
            })
        }

        return course
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal mengambil detail kursus',
        })
    }
})