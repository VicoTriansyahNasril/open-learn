// path: open-learn-app/server/api/stats/kpi.get.ts
import { Prisma } from '@prisma/client'
import db from '~/server/utils/db'
import { requireUserSession } from '~/server/utils/session'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
    const user = await requireUserSession(event)

    if (user.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    try {
        const uniqueUserProgressResult = await db.$queryRaw<Array<{ count: bigint }>>(
            Prisma.sql`SELECT COUNT(DISTINCT "userId") AS "count" FROM "LessonProgress"`
        )

        const totalEnrollments = Number(uniqueUserProgressResult[0]?.count ?? 0n)

        const [totalUsers, totalCourses, totalLessons] = await db.$transaction([
            db.user.count(),
            db.course.count(),
            db.lesson.count(),
        ])

        return {
            totalUsers,
            totalCourses,
            totalLessons,
            totalEnrollments,
        }
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil data KPI.' })
    }
})
