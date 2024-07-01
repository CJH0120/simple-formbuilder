"use client"
import { useEffect, useState } from "react"
import style from "./form.module.scss"
import Select from "./ui/select"
import { CiWarning } from "react-icons/ci"
import RadioList from "./ui/radio"
import CheckBoxList from "./ui/checkbox"

enum FormAnswerType {
	TEXT,
	LONG_TEXT,
	SELECT,
	CHECKBOX,
	RADIO,
	IMAGE,
}

interface FormItemProps {
	id: string
	order: number
	isRequired: boolean
	q: {
		title: string
		desc?: string
	}
	a?: {
		type: FormAnswerType
		option?: string[] | string
	}
}

interface FormHeader {
	title: string
	desc?: string
}

interface FormProps {
	header: FormHeader
	items: FormItemProps[]
}

const Form = ({ header, items }: FormProps) => {
	const [values, setValues] = useState<
		{ id: string; value: string | undefined | string[] }[]
	>([])

	useEffect(() => {
		const transformedItems = items?.map((v) => ({
			id: v.id,
			value: v.a?.type === FormAnswerType.CHECKBOX ? [] : undefined,
		}))
		setValues(transformedItems)
	}, [items])
	const handleChangeObject = (n: string | undefined | string[], id: string) => {
		setValues(values.map((v) => (v.id === id ? { ...v, value: n } : v)))
	}

	return (
		<div className={style.form}>
			<header className={style.header}>
				<div className={style.head}>
					<div className={style.head_text_wrap}>
						<h1>{header?.title}</h1>
						<p>{header?.desc}</p>
					</div>
				</div>
			</header>

			<div className={style.form_wrap}>
				<form
					className={style.form_items}
					onSubmit={(e) => {
						e.preventDefault()
						alert("Take a look at the console")
						console.log(values)
					}}
				>
					{values &&
						items?.map((item) => (
							<FormItem
								onChange={handleChangeObject}
								key={item.id}
								{...item}
								value={values.find((v) => v.id === item.id)?.value ?? ""}
							/>
						))}
					<button type="submit">submit</button>
				</form>
			</div>
		</div>
	)
}
export default Form

const FormItem = ({
	isRequired,
	q,
	a,

	onChange,
	value,
	id,
}: FormItemProps & {
	value: string | undefined | string[]
	onChange: (n: string | undefined | string[], id: string) => void
}) => {
	const [isError, setIsError] = useState<boolean>(false)
	const handleChange = (n: string | undefined, id: string) => {
		if (isRequired && !n) {
			setIsError(true)
		} else {
			setIsError(false)
		}
		onChange(n, id)
	}

	const handleCheckBox = (n: string, id: string) => {
		const currentValue = value as string[]
		const newValue = currentValue.includes(n)
			? currentValue.filter((item) => item !== n)
			: [...currentValue, n]
		onChange(newValue, id)
	}

	return (
		<div
			className={[style.form_item_wrapper, isError && style.isError].join(" ")}
		>
			<label className={style.from_item_label}>
				{q.title} {isRequired && <i style={{ color: "red" }}>*</i>}
			</label>
			{q.desc && <p className={style.from_item_desc}>{q.desc}</p>}
			{a && a.type === FormAnswerType.SELECT && (
				<Select
					id={id}
					options={a.option as string[]}
					onChange={(n) => handleChange(n, id)}
					value={value as string}
				/>
			)}

			{a && a.type === FormAnswerType.RADIO && (
				<RadioList
					id={id}
					onChange={(n) => handleChange(n, id)}
					values={a.option as string[]}
				/>
			)}

			{a && a.type === FormAnswerType.TEXT && (
				<input
					className={style.text_type}
					value={value || ""}
					onChange={(e) => handleChange(e.currentTarget.value, id)}
				/>
			)}

			{a && a.type === FormAnswerType.LONG_TEXT && (
				<textarea
					className={style.long_text_type}
					value={value || ""}
					onChange={(e) => handleChange(e.currentTarget.value, id)}
				/>
			)}
			{a && a.type === FormAnswerType.CHECKBOX && (
				<CheckBoxList
					id={id}
					value={value as string[]}
					option={a.option as string[]}
					onChange={handleCheckBox}
				/>
			)}
			{isError && (
				<div className={style.warning_message}>
					<CiWarning />
					<span className={style.warning_message_text}>
						This is an essential question.
					</span>
				</div>
			)}
		</div>
	)
}
