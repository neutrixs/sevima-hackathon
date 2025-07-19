import { compare } from "@/lib/hasher"
import {prisma} from "@/lib/prisma"
import { createSessionCookie } from "@/lib/session"

const invalidLoginResponse = Response.json({
    message: "unauthorized"
}, {status: 401})

export async function POST(req: Request) {
    if (req.headers.get('content-type') !== "application/json") return Response.json({
        message: "content-type must be application/json"
    }, {status: 400})

    let body
    try {
        body = await req.json()
    } catch (e) {
        return Response.json({
            message: e instanceof Error ? e.message : "JSON error"
        }, {status: 400})
    }

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
            'Set-Cookie': `session=${cookie}; SameSite=Strict`
        }
    })
}