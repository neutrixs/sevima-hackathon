import {prisma} from "@/lib/prisma"
const LENGTH = 16
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

export async function createSessionCookie(id: string) {
    let cookie = ""
    do {
        cookie = createCookie()
    } while (await notUnique(cookie))

    await prisma.session.upsert({
        where: {
            id
        },
        update: {
            cookie
        },
        create: {
            id,
            cookie
        }
    })

    return cookie
}

async function notUnique(cookie: string) {
    const exists = prisma.session.findFirst({
        where: {
            cookie
        }
    })

    return exists
}

function createCookie() {
    let result = ""
    for (let i = 0; i < LENGTH; i++) {
        result += characters[Math.floor(Math.random() * characters.length)]
    }

    return result
}