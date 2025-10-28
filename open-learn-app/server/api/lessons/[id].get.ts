import db from '~/server/utils/db'
import { requireUserSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
    const user = await requireUserSession(event)

    try {
        const lessonId = event.context.params?.id
        const userId = user.id

        if (!lessonId) {
            throw createError({ statusCode: 400, statusMessage: 'ID Pelajaran tidak ditemukan.' })
        }

        const lesson = await db.lesson.findUnique({
            where: { id: lessonId },
        })

        if (!lesson) {
            throw createError({ statusCode: 404, statusMessage: 'Pelajaran tidak ditemukan.' })
        }

        const course = await db.course.findFirst({
            where: {
                modules: {
                    some: {
                        lessons: {
                            some: {
                                id: lessonId,
                            },
                        },
                    },
                },
            },
            include: {
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                            select: {
                                id: true,
                                title: true,
                                order: true,
                                progress: {
                                    where: { userId },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!course) {
            throw createError({ statusCode: 404, statusMessage: 'Kursus terkait tidak ditemukan.' })
        }

        return {
            lesson,
            course,
        }

    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil data pelajaran.' })
    }
})