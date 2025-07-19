import { compare } from "@/lib/hasher"
import validate from "@/lib/postRequestValidator"
import {prisma} from "@/lib/prisma"
import { createSessionCookie } from "@/lib/session"

const invalidLoginResponse = Response.json({
    message: "unauthorized"
}, {status: 401})

export async function POST(req: Request) {
    const validator = await validate(req, ["id", "password"])
    if (!validator.valid) return validator.response

    const body = validator.body

    const id = body.id
    const password = body.password

    if (!id || !password) return Response.json({
        message: "required fields: id and password"
    }, {status: 400})

    const userData = await prisma.user.findFirst({
        where: {
            id
        }
    })

    if (!userData) return invalidLoginResponse
    const storedHash = userData.hash

    const match = await compare(password, storedHash)
    if (!match) return invalidLoginResponse

    const cookie = await createSessionCookie(id)
    return Response.json({
        message: "success"
    }, {
        headers: {
            'Set-Cookie': `session=${cookie}; SameSite=Strict; Path=/`
        }
    })
}