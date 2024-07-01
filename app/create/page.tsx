"use client"
import { useEffect, useState } from "react"
import { RiDeleteBin6Line, RiFileCopyFill } from "react-icons/ri"
import style from "./page.module.scss"
import dummy from "@/public/default/json/1.json"
import { generateRandomString } from "@/components/form/utils/random"
import { useRouter } from "next/navigation"
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
	a: {
		type: FormAnswerType
		option?: string[] | string
	}
}

type FormHeader = {
	title: string
	desc: string
}
const CreatePage = () => {
	const [headerValue, setHeaderValue] = useState<FormHeader>({
		title: "",
		desc: "",
	})

	const [itemValue, setItemValue] = useState<FormItemProps[]>(
		dummy as FormItemProps[]
	)
	const [focusId, setFocusId] = useState<string>("")

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setHeaderValue((prev) => ({ ...prev, [name]: value }))
	}

	const handleFocus = (id: string) => {
		setFocusId(id)
	}

	// 타입 변환 숫자로 판별
	const handleItemTypeChange = (type: number, id: string) => {
		if (type < 2) {
			return setItemValue((prev) => {
				return prev.map((v) => {
					if (v.id === id) {
						return { ...v, a: { ...v.a, type: type, option: undefined } }
					}
					return v
				})
			})
		}

		const options = itemValue.find((v) => v.id === id)?.a?.option
		if (!options) {
			return setItemValue((prev) => {
				return prev.map((v) => {
					if (v.id === id) {
						return {
							...v,
							a: { ...v.a, type: type, option: ["new option1", "new option2"] },
						}
					}
					return v
				})
			})
		}
		setItemValue((prev) => {
			return prev.map((v) => {
				if (v.id === id) {
					return { ...v, a: { ...v.a, type: type } }
				}
				return v
			})
		})
	}
	//
	const handleItemHeaderChange = (
		value: string,
		id: string,
		type: "title" | "desc"
	) => {
		setItemValue((prev) => {
			return prev.map((v) => {
				if (v.id === id) {
					return { ...v, q: { ...v.q, [type]: value } }
				}
				return v
			})
		})
	}
	useEffect(() => {
		console.log(itemValue)
	}, [itemValue])

	const handleItemChange = (options: string[], id: string) => {
		setItemValue((v) =>
			v.map((v) => (v.id === id ? { ...v, a: { ...v.a, option: options } } : v))
		)
	}
	const handleItemRequiredChange = (value: boolean, id: string) => {
		setItemValue((v) =>
			v.map((v) => (v.id === id ? { ...v, isRequired: value } : v))
		)
	}
	const handleItemCopy = async (id: string) => {
		const newId = generateRandomString(5)
		await new Promise<void>((resolve) => {
			const index = itemValue.findIndex((v) => v.id === id)

			if (index === -1) {
				console.error(`Item with id ${id} not found.`)
				resolve()
				return
			}

			const newItem = { ...itemValue[index], id: newId }

			setItemValue((prev) => {
				const newArray = [
					...prev.slice(0, index + 1),
					newItem,
					...prev.slice(index + 1),
				]
				return newArray
			})

			resolve()
		})

		setFocusId(newId)
	}

	const handleItemDelete = (id: string) => {
		setItemValue((v) => v.filter((v) => v.id !== id))
	}
	const router = useRouter()

	const handleSubmit = async () => {
		if (!headerValue.title || !itemValue.length)
			return alert("입력해주세요")
		const formId = generateRandomString(10)
		const form = new FormData()
		form.append("header", JSON.stringify(headerValue))
		form.append("items", JSON.stringify(itemValue))
		form.append("formId", formId)
		await fetch("/api/create", {
			method: "POST",
			body: form,
		}).then((v) => {
			if (v.status === 200) {
				alert("생성되었습니다")
				router.push(`/form/${formId}`)
			} else {
				alert("생성에 실패했습니다")
			}
		})
	}
	return (
		<main className={style.page}>
			<div className={style.container}>
				<div className={style.header_wrap}>
					<div
						className={style.header_item}
						data-set="header"
						onClick={() => setFocusId("header")}
					>
						<div
							className={[
								style.header_focus_wrap,
								focusId === "header" && style.focus,
							].join(" ")}
						/>
						<div className={style.header_content}>
							<div className={style.header_title_wrap}>
								<input
									className={style.header_title}
									onChange={handleChange}
									name="title"
									placeholder="Title(required)"
									value={headerValue.title}
								/>
							</div>
							<div className={style.header_desc_wrap}>
								<textarea
									className={style.header_desc}
									name="desc"
									onChange={handleChange}
									value={headerValue.desc}
									placeholder="Desc(optional)"
								/>
							</div>
						</div>
					</div>
				</div>
				{/*  */}
				<div className={style.item_form_wrap}>
					{itemValue.map((v, i) => (
						<AddSection
							handleDelete={handleItemDelete}
							handleCopy={handleItemCopy}
							handleRequired={handleItemRequiredChange}
							handleChangeItem={handleItemChange}
							handleChangeHeader={handleItemHeaderChange}
							handleChangeType={handleItemTypeChange}
							handleFocus={handleFocus}
							isFocus={focusId === v.id}
							item={v}
							key={v.id}
						/>
					))}
				</div>
				<button onClick={handleSubmit} className={style.button_submit}>
					제작
				</button>
			</div>
		</main>
	)
}
export default CreatePage

interface AddSectionProps {
	isFocus: boolean
	item: FormItemProps
	handleChangeHeader: (
		value: string,
		id: string,
		type: "title" | "desc"
	) => void
	handleChangeItem: (options: string[], id: string) => void
	handleCopy: (id: string) => void
	handleDelete: (id: string) => void
	handleRequired: (value: boolean, id: string) => void
	handleChangeType: (type: number, id: string) => void
	handleFocus: (id: string) => void
}
const AddSection = ({
	handleChangeHeader,
	handleChangeItem,
	handleCopy,
	handleDelete,
	handleRequired,
	handleChangeType,
	handleFocus,
	isFocus,
	item,
}: AddSectionProps) => {
	const TypeArray = Object.values(FormAnswerType).filter(
		(v) => typeof v === "number"
	)

	const switchText = (type: FormAnswerType) => {
		switch (type) {
			case FormAnswerType.TEXT:
				return "단답형"
			case FormAnswerType.LONG_TEXT:
				return "장문형"
			case FormAnswerType.SELECT:
				return "드롭다운"
			case FormAnswerType.CHECKBOX:
				return "체크박스"
			case FormAnswerType.RADIO:
				return "객관식 질문"
			case FormAnswerType.IMAGE:
				return "이미지 업로드"
		}
	}

	return (
		<div
			data-set={item.id}
			className={style.item_add_wrap}
			onClick={() => handleFocus(item.id)}
		>
			<div className={style.item_add}>
				<div
					className={[style.item_add_focus_wrap, isFocus && style.focus].join(
						" "
					)}
				/>
				<div className={style.item_content}>
					{/* head + desc */}
					<div className={style.item_content_head}>
						{/* head */}
						<div className={style.item_content_head_wrap}>
							<input
								placeholder="Title"
								className={style.item_content_head_input}
								defaultValue={item.q.title}
								onChange={(e) =>
									handleChangeHeader(e.target.value, item.id, "title")
								}
							/>
							<select
								defaultValue={item.a?.type}
								onChange={(e) => {
									const selectedType = e.target.value
									handleChangeType(Number(selectedType), item.id)
								}}
							>
								{TypeArray.map((v) => (
									<option value={v} key={v}>
										{switchText(v as FormAnswerType)}
									</option>
								))}
							</select>
						</div>
						{/* desc */}
						<div className={style.item_content_desc_wrap}>
							<textarea
								placeholder="Description (option)"
								className={style.item_content_desc}
								defaultValue={item.q.desc ?? ""}
								onChange={(e) =>
									handleChangeHeader(e.target.value, item.id, "desc")
								}
							/>
						</div>
					</div>
					{/* CONTENT */}
					<div className={style.item_options}>
						{(item.a?.type === FormAnswerType.CHECKBOX ||
							item.a?.type === FormAnswerType.SELECT ||
							item.a?.type === FormAnswerType.RADIO) && (
							<EditOptions
								isFocus={isFocus}
								onChange={handleChangeItem}
								id={item.id}
								options={item.a?.option as string[]}
								type={item.a.type}
							/>
						)}
						{item.a?.type === FormAnswerType.LONG_TEXT && (
							<textarea
								readOnly
								className={style.item_content_long_text}
								placeholder="Answer Area"
								value={item.a?.option as string}
							/>
						)}
						{item.a?.type === FormAnswerType.TEXT && (
							<input
								readOnly
								className={style.item_content_long_text}
								placeholder="Answer Area"
								value={item.a?.option as string}
							/>
						)}
					</div>
					{isFocus && (
						<div className={style.option_utils}>
							<RiFileCopyFill
								onClick={() => handleCopy(item.id)}
								className={style.option_utils_icons}
							/>
							<RiDeleteBin6Line
								onClick={() => handleDelete(item.id)}
								className={style.option_utils_icons}
							/>
							<div className={style.option_utils_required}>
								<label
									htmlFor="required"
									className={style.option_utils_required_label}
								>
									<span>Required</span>
									<input
										onChange={() => handleRequired(!item.isRequired, item.id)}
										checked={item.isRequired}
										id="required"
										type="checkbox"
									/>
								</label>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

/*
TEXT,
LONG_TEXT,
SELECT,
CHECKBOX,
RADIO,
IMAGE,
*/

interface EditOptionsProps {
	options: string[]
	id: string
	type: FormAnswerType
	isFocus: boolean
	onChange: (options: string[], id: string) => void
}
const EditOptions = ({
	id,
	options,
	type,
	isFocus,
	onChange: handleChange,
}: EditOptionsProps) => {
	const handleAddOption = (value: string) => {
		handleChange([...options, value], id)
	}

	const handleRemoveOption = (value: string) => {
		if (options.length === 1) return
		handleChange(
			options.filter((v) => v !== value),
			id
		)
	}
	const handleUpdateOption = (value: string, index: number) => {
		const data = options.map((v, i) => (i === index ? value : v))
		handleChange(data, id)
	}
	return (
		<div className={style.edit_options}>
			{options?.map((v, index) => (
				<div className={style.edit_option_content} key={v + index}>
					<div className={style.edit_option_content_input_wrap}>
						{FormAnswerType.CHECKBOX === type && <input type={"checkbox"} />}
						{FormAnswerType.RADIO === type && <input type={"radio"} />}

						{
							<input
								className={style.edit_option_content_input}
								defaultValue={v}
								readOnly={!isFocus}
								placeholder="add option... "
								onBlur={(e) => handleUpdateOption(e.target.value, index)}
							/>
						}
					</div>

					<div className={style.edit_option_content_remove}>
						<RiDeleteBin6Line onClick={() => handleRemoveOption(v)} />
					</div>
				</div>
			))}
			{isFocus && (
				<div onClick={() => handleAddOption("new option")}>
					<button className={style.add_option}>옵션추가</button>
				</div>
			)}
		</div>
	)
}
