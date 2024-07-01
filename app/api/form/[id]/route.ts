import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const slug = params.id
		const dirPath = path.join(process.cwd(), "public", "default", "json")
		const filePath = path.join(dirPath, `${slug}.json`)

		// 파일 읽기
		const fileContents = await fs.readFile(filePath, "utf8")
		const jsonData = JSON.parse(fileContents)

		return new NextResponse(JSON.stringify(jsonData), {
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		console.error("Error reading file:", error)
		return new NextResponse("File not found", { status: 404 })
	}
}
