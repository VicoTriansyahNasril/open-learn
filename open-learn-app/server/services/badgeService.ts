import db from '~/server/utils/db'

const BADGE_DEFINITIONS = {
    FIRST_LESSON: {
        name: 'First Lesson',
        description: 'Selesaikan pelajaran pertamamu.',
        icon: '🎓',
    },
    TEN_LESSONS: {
        name: 'Ten Lessons',
        description: 'Selesaikan 10 pelajaran.',
        icon: '📚',
    },
} as const;

async function seedBadges() {
    for (const key in BADGE_DEFINITIONS) {
        const badge = BADGE_DEFINITIONS[key as keyof typeof BADGE_DEFINITIONS];
        await db.badge.upsert({
            where: { name: badge.name },
            update: {},
            create: {
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
            },
        });
    }
}

seedBadges();

export async function checkAndAwardBadges(userId: string) {
    const awardedBadges: Awaited<ReturnType<typeof db.badge.findUnique>>[] = [];

    const userWithProgress = await db.user.findUnique({
        where: { id: userId },
        include: {
            progress: true,
            badges: { include: { badge: true } },
        },
    });

    if (!userWithProgress) return [];

    const completedLessonsCount = userWithProgress.progress.length;
    const userBadgeNames = userWithProgress.badges.map(userBadge => userBadge.badge.name);

    if (completedLessonsCount >= 1 && !userBadgeNames.includes(BADGE_DEFINITIONS.FIRST_LESSON.name)) {
        const badge = await db.badge.findUnique({ where: { name: BADGE_DEFINITIONS.FIRST_LESSON.name } });
        if (badge) {
            await db.userBadge.create({ data: { userId, badgeId: badge.id } });
            awardedBadges.push(badge);
        }
    }

    if (completedLessonsCount >= 10 && !userBadgeNames.includes(BADGE_DEFINITIONS.TEN_LESSONS.name)) {
        const badge = await db.badge.findUnique({ where: { name: BADGE_DEFINITIONS.TEN_LESSONS.name } });
        if (badge) {
            await db.userBadge.create({ data: { userId, badgeId: badge.id } });
            awardedBadges.push(badge);
        }
    }

    return awardedBadges.filter(b => b !== null);
}