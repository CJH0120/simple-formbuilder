import { useId } from "react"
import style from "./radio.module.scss"

type RadioProp = {
	value: string
	groupId: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Radio = ({ value, groupId, onChange }: RadioProp) => {
	const id = useId()
	return (
		<label htmlFor={id} className={style.radio}>
			<input
				name={groupId}
				type="radio"
				id={id}
				value={value}
				onChange={onChange}
			/>
			<span className={style.radio_text}>{value}</span>
		</label>
	)
}

type RadioPropList = {
	values: string[]
	id: string
	onChange: (n: string | undefined, id: string) => void
}

const RadioList = ({
	id,
	values,
	onChange: handleListChange,
}: RadioPropList) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget
		handleListChange(value, id)
	}
	const groupId = useId()
	return (
		<div className={style.radio_group}>
			{values.map((v) => (
				<Radio onChange={handleChange} groupId={groupId} value={v} key={v} />
			))}
		</div>
	)
}

export default RadioList
