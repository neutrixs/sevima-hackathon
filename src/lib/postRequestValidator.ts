interface valid {
    valid: true
    body: any
}

interface invalid {
    valid: false,
    response: Response
}

export default async function validate(req: Request, requiredFields: string[]): Promise<valid | invalid> {
    if (req.headers.get('content-type') !== "application/json") {
        const response = Response.json({
            message: "content-type must be application/json"
        }, {status: 400})

        return {
            valid: false,
            response
        }
    }

    let body
    try {
        body = await req.json()
    } catch (e) {
        const response = Response.json({
            message: e instanceof Error ? e.message : "JSON error"
        }, {status: 400})

        return {
            valid: false,
            response
        }
    }

    let missingFields = false
    for (const field of requiredFields) {
        if (!(field in body)) {
            missingFields = true
        }
    }

    if (missingFields) {
        const response = Response.json({
            message: `required fields: ${requiredFields.join(", ")}`
        }, {status: 400})

        return {
            valid: false,
            response
        }
    }

    return {
        valid: true,
        body
    }
}