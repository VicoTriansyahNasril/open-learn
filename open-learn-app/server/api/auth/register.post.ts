import { readBody } from 'h3'
import bcrypt from 'bcrypt'
import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const { name, email, password } = await readBody(event)

    if (!name || !email || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Nama, email, dan password dibutuhkan.' })
    }

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
        throw createError({ statusCode: 409, statusMessage: 'Email sudah terdaftar.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        }
    })

    setResponseStatus(event, 201)
    return {
        message: 'Registrasi berhasil',
        user: newUser,
    }
})