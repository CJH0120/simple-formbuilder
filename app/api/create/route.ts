import { promises as fs } from "fs"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData()
		const data = formData.get("items")
		const header = formData.get("header")
		const formId = formData.get("formId")
		console.log(data)
		console.log(header)

		const parsedItems = JSON.parse(data as string)
		const parsedHeader = JSON.parse(header as string)

		const jsonData = {
			header: parsedHeader,
			items: parsedItems,
		}

		const dirPath = path.join(process.cwd(), "public", "default", "json")
		const filePath = path.join(dirPath, `${formId}.json`)

		try {
			await fs.access(dirPath)
		} catch (error) {
			await fs.mkdir(dirPath, { recursive: true })
		}

		await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2))

		return new NextResponse("ok")
	} catch (error) {
		console.error("Error handling POST request:", error)
		return new NextResponse("error", { status: 500 })
	}
}
