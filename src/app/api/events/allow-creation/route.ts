import { getUserID } from "@/lib/session";
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const userID = await getUserID(req)
    if (!userID) return Response.json({
        message: "invalid session"
    }, {status: 401})

    const data = await prisma.user.findFirst({
        where: {
            id: userID
        }
    })

    if (!data) return Response.json({
        message: "invalid session"
    }, {status: 401})

    return Response.json(data.role == "Admin")
}