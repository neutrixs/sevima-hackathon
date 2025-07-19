import validate from "@/lib/postRequestValidator";
import { getUserID } from "@/lib/session";
import {prisma} from "@/lib/prisma"

export async function POST(req: Request) {
    const validator = await validate(req, ["eventID", "candidateID"])
    if (validator.valid === false) {
        return validator.response
    }

    const body = validator.body
    const {eventID, candidateID} = body

    const userID = await getUserID(req)
    if (!userID) return Response.json({
        message: "invalid credential"
    }, {status: 401})

    const voteExist = await prisma.vote.findFirst({
        where: {
            eventID: eventID.toString(),
            userID
        }
    })

    if (voteExist) return Response.json({
        message: "already voted"
    }, {status: 403})

    if (isNaN(eventID)) return Response.json({
        message: "eventID must be a number"
    }, {status: 400})
    const idInt = parseInt(eventID)

    // check if candidate exists
    const event = await prisma.event.findFirst({
        where: {
            id: idInt,
            candidateIDs: {
                has: candidateID
            }
        }
    })

    if (!event) return Response.json({
        message: "candidate doesn't exist"
    }, {status: 400})

    // check if the event is still active
    const currentTime = Math.floor(new Date().getTime() / 1000)
    if (event.startEpoch > currentTime || currentTime >= event.endEpoch) return Response.json({
        message: "event does not allow voting as of now"
    }, {status: 403})

    const result = await prisma.vote.create({
        data: {
            candidateID,
            eventID: eventID.toString(),
            userID,
            createdAtEpoch: Math.floor(new Date().getTime() / 1000)
        }
    })

    if (result) return Response.json({
        message: "success"
    })
}