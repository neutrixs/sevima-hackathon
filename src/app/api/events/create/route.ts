import parseCookie from "@/lib/cookieParser";
import validate from "@/lib/postRequestValidator";
import {prisma} from "@/lib/prisma"

// we also check if they're "Admin" (only admin can create events)
async function sufficientPermission(id: string) {
    const user = await prisma.user.findFirst({
        where: {
            id,
            role: "Admin"
        }
    })

    return !!user
}

async function validCredential (req: Request) {
    const cookie = parseCookie(req.headers.get("cookie") || "")
    if (!cookie.session) return false

    const session = await prisma.session.findFirst({
        where: {
            cookie: cookie.session
        }
    })

    return session?.id || false
}

export async function POST(req: Request) {
    const userID = await validCredential(req)
    if (!userID) return Response.json({
        message: "invalid credential"
    }, {status: 401})

    const allowed = await sufficientPermission(userID)
    if (!allowed) return Response.json({
        message: "forbidden"
    }, {status: 403})

    const validator = await validate(req, ["name", "startEpoch", "endEpoch", "candidateIDs"])
    if (!validator.valid) return validator.response

    const body = validator.body
    const {name, startEpoch, endEpoch, candidateIDs} = body
    // validate whether candidate IDs exist

    const idNotExist: string[] = []

    for (const id of candidateIDs) {
        const exist = await prisma.user.findFirst({
            where: {
                id
            }
        })

        if (!exist) idNotExist.push(id)
    }

    if (idNotExist.length > 0) {
        return Response.json({
            message: `candidate ID ${idNotExist.join(", ")} do${idNotExist.length == 1 ? "es" : ""} not exist`
        }, {status: 400})
    }

    if (typeof startEpoch != "number" || typeof endEpoch != "number") {
        return Response.json({
            message: "epoch must be a number"
        }, {status: 400})
    }

    if (startEpoch >= endEpoch) {
        return Response.json({
            message: "invalid epoch range"
        }, {status: 400})
    }

    const data = await prisma.event.create({
        data: {
            name,
            startEpoch,
            endEpoch,
            candidateIDs
        }
    })

    if (data) return Response.json({
        message: "success"
    })
}