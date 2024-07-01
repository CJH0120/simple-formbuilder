"use client"
import useIframe from "@/components/useIframe/useIframe"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const handleClose = () => setIsOpen(false)
	const { IframeComponent, closeIframe, isIframeOpen } = useIframe({
		url: "http://localhost:3000/form/2iaBorD5hFIp6V7",
		maxWidth: "400px",
		isClose: handleClose,
		isOpen: isOpen,
	})
	return (
		<main
			style={{
				display: "flex",
				justifyContent: "center",
				padding: "20px",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<Link
					href="/create"
					style={{
						border: "1px solid black",
						padding: "10px",
						textAlign: "center",

						cursor: "pointer",
						borderRadius: "4px",
					}}
				>
					try Create
				</Link>
				<button
					style={{
						border: "1px solid black",
						padding: "10px",
						textAlign: "center",

						cursor: "pointer",
						borderRadius: "4px",
					}}
					onClick={() => setIsOpen(true)}
				>
					use Form
				</button>
			</div>
			{IframeComponent()}
		</main>
	)
}
