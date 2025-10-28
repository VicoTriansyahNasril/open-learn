import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    try {
        const moduleId = event.context.params?.id;
        if (!moduleId) throw createError({ statusCode: 400, statusMessage: 'ID Modul tidak ditemukan.' });

        await db.module.delete({ where: { id: moduleId } });
        setResponseStatus(event, 204);
        return;
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Gagal menghapus modul.' });
    }
});