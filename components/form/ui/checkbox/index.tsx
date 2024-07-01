import { useState } from "react"
import style from "./checkbox.module.scss"

interface CheckBoxProps {
	option: string
	values: string[]
	onChange: (option: string) => void
}

const CheckBox = ({ option, values, onChange }: CheckBoxProps) => {
	const handleChange = () => {
		onChange(option)
	}

	return (
		<label className={style.checkBox}>
			<input
				type="checkbox"
				checked={values?.includes(option)}
				onChange={handleChange}
			/>
			<span>{option}</span>
		</label>
	)
}

interface ListProps {
	option: string[]
	onChange: (n: string, id: string) => void
	id: string
	value: string[]
}

const CheckBoxList = ({ value, id, onChange, option }: ListProps) => {
	const handleChange = (option: string) => {
		onChange(option, id)
	}

	return (
		<div className={style.checkBox_list}>
			{option.map((v) => (
				<CheckBox key={v} option={v} values={value} onChange={handleChange} />
			))}
		</div>
	)
}

export default CheckBoxList
