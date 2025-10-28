import { readBody } from 'h3'
import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const moduleId = event.context.params?.id;
        const { title } = await readBody(event);
        if (!moduleId) throw createError({ statusCode: 400, statusMessage: 'ID Modul tidak ditemukan.' });

        return db.module.update({
            where: { id: moduleId },
            data: { title },
        });
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Gagal memperbarui modul.' });
    }
});