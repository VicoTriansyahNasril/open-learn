import { readBody, createError } from 'h3'
import bcrypt from 'bcrypt'
import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const { email, password } = await readBody(event)

    if (!email || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Email dan password dibutuhkan.' })
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Email atau password salah.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw createError({ statusCode: 401, statusMessage: 'Email atau password salah.' })
    }

    const userSessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const session = await useSession(event, { password: config.sessionPassword })
    await session.update({ user: userSessionData })

    return userSessionData
})