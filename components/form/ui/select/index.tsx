"use client"
import React from "react"
import { useEffect, useRef, useState } from "react"
import style from "./select.module.scss"
import { IoIosArrowDown } from "react-icons/io"
interface SelectProps {
	onChange: (n: string | undefined, id: string) => void
	options: string[]
	value: string | undefined
	id: string
}

const Select = ({
	id,
	value,
	onChange: handleSelect,
	options,
}: SelectProps) => {
	const [isActive, setIsActive] = useState(false)
	const handleActive = () => {
		setIsActive((active) => !active)
	}

	const SelectNone = () => {
		return <p className={style.none}>Select</p>
	}

	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const clickModalOutside = (event: MouseEvent) => {
			if (
				ref.current &&
				!ref.current.contains(event.target as Node) &&
				isActive
			) {
				handleSelect(value, id)
				setIsActive(false)
			}
		}
		document.addEventListener("mousedown", clickModalOutside)

		return () => {
			document.removeEventListener("mousedown", clickModalOutside)
		}
	}, [isActive, id, value, handleSelect])

	return (
		<div className={style.select_wrap} ref={ref}>
			<div
				className={[style.select_container, isActive ? style.active : ""].join(
					" "
				)}
			>
				<div
					className={[
						style.select_content,
						!isActive ? style.content_passive : style.content_active,
					].join(" ")}
					onClick={() => {
						if (isActive) {
							handleSelect(undefined, id)
						}
						handleActive()
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						{isActive || !value ? <SelectNone /> : <p>{value}</p>}
						<IoIosArrowDown
							className={[style.icon, isActive && style.icon_active].join(" ")}
						/>
					</div>
				</div>
				{isActive && <hr />}
				{isActive &&
					options.map((option, index) => (
						<div
							className={[
								style.select_content,
								isActive && style.content_active,
							].join(" ")}
							key={index}
							onClick={() => {
								handleSelect(option, id)
								setIsActive(false)
							}}
						>
							{option}
						</div>
					))}
			</div>
		</div>
	)
}

export default Select
