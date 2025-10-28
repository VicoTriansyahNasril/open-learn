import { readBody } from 'h3'
import db from '~/server/utils/db'
import { requireUserSession } from '~/server/utils/session'
import { checkAndAwardBadges } from '~/server/services/badgeService'

const XP_PER_LESSON = 100;
const calculateLevel = (xp: number) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export default defineEventHandler(async (event) => {
    const user = await requireUserSession(event)

    try {
        const { lessonId } = await readBody(event)
        const userId = user.id

        if (!lessonId) {
            throw createError({ statusCode: 400, statusMessage: 'ID Pelajaran dibutuhkan.' })
        }

        const existingProgress = await db.lessonProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
        })

        if (existingProgress) {
            return { message: 'Pelajaran sudah diselesaikan sebelumnya.' }
        }

        const [, updatedUser] = await db.$transaction([
            db.lessonProgress.create({ data: { userId, lessonId } }),
            db.user.update({
                where: { id: userId },
                data: { xp: { increment: XP_PER_LESSON } },
            }),
        ]);

        const newLevel = calculateLevel(updatedUser.xp);
        if (newLevel > updatedUser.level) {
            await db.user.update({
                where: { id: userId },
                data: { level: newLevel },
            });
        }

        const awardedBadges = await checkAndAwardBadges(userId);

        setResponseStatus(event, 201)
        return {
            message: `Selamat! Anda mendapatkan ${XP_PER_LESSON} XP.`,
            newLevel: newLevel > updatedUser.level ? newLevel : null,
            awardedBadges: awardedBadges,
        }

    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Gagal menyimpan progres.' })
    }
})