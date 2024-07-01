// Select.test.tsx
import React from "react"
import { render, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import Select from "./index"
import { describe, it, expect, vi } from "vitest"

describe("Select Component", () => {
	const mockOnChange = vi.fn()
	const options = ["Option 1", "Option 2", "Option 3"]
	const id = "test-select"

	it("should close options when clicked outside", () => {
		const { getByText } = render(
			<Select
				id={id}
				value={undefined}
				onChange={mockOnChange}
				options={options}
			/>
		)

		const selectContent = getByText("Select")
		fireEvent.click(selectContent)

		options.forEach((option) => {
			expect(getByText(option)).toBeInTheDocument()
		})

		fireEvent.mouseDown(document)
	})

	it("should display the selected option", () => {
		const { getByText } = render(
			<Select
				id={id}
				value="Option 1"
				onChange={mockOnChange}
				options={options}
			/>
		)

		expect(getByText("Option 1")).toBeInTheDocument()
	})

	it("should not display options initially", () => {
		const { queryByText } = render(
			<Select
				id={id}
				value={undefined}
				onChange={mockOnChange}
				options={options}
			/>
		)

		options.forEach((option) => {
			expect(queryByText(option)).not.toBeInTheDocument()
		})
	})

	it("should toggle the options list when clicked", () => {
		const { getByText } = render(
			<Select
				id={id}
				value={undefined}
				onChange={mockOnChange}
				options={options}
			/>
		)

		const selectContent = getByText("Select")

		// 옵션을 열기
		fireEvent.click(selectContent)
		options.forEach((option) => {
			expect(getByText(option)).toBeInTheDocument()
		})
	})
})
