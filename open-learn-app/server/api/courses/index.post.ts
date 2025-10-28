import { readBody } from 'h3';
import db from '~/server/utils/db';
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        if (!body.title || !body.slug || !body.category || !body.level) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Data yang dimasukkan tidak lengkap.',
            });
        }

        const newCourse = await db.course.create({
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                category: body.category,
                level: body.level,
                imageUrl: body.imageUrl,
                publishedAt: new Date(),
            },
        });

        setResponseStatus(event, 201);
        return {
            message: 'Kursus berhasil dibuat',
            course: newCourse,
        };
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            throw createError({
                statusCode: 409,
                statusMessage: 'Slug sudah digunakan. Harap gunakan slug lain.',
            });
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Terjadi kesalahan saat membuat kursus.',
        });
    }
});