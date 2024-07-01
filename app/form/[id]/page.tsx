import Form from "@/components/form"
export const revalidate = 10
const getData = async (id: string) => {
	const data = await fetch(
		`${
			process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
		}/api/form/${id}`
	).then((v) => v.json())
	return data
}

export default async function Page({ params }: { params: { id: string } }) {
	const { header, items } = await getData(params.id)

	return <Form header={header} items={items} />
}
