import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const courses = await db.course.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return courses;
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Gagal mengambil data kursus.',
        });
    }
});