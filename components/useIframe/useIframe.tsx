"use client"
import { useState, useEffect } from "react"
import style from "./useIframe.module.scss"

interface useIframeProps {
	url: string
	maxWidth: string
	isOpen: boolean
	isClose: () => void
}

const useIframe = ({ isClose, isOpen, url, maxWidth }: useIframeProps) => {
	const [isIframeOpen, setIframeOpen] = useState(isOpen)

	useEffect(() => {
		setIframeOpen(isOpen)
	}, [isOpen])

	const closeIframe = () => {
		setIframeOpen(false)
		isClose()
	}

	const IframeComponent = () =>
		isIframeOpen ? (
			<div className={style.hook_wrap}>
				<div
					className={style.hook_container}
					style={{
						maxWidth,
					}}
				>
					<iframe className={style.iframe} src={url} title="Custom Iframe" />
					<button onClick={closeIframe} className={style.close_button}>
						Close
					</button>
				</div>
			</div>
		) : null

	return {
		IframeComponent,
		closeIframe,
		isIframeOpen,
	}
}

export default useIframe
