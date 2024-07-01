interface TextProps {
	onChange: (v: string, id: string) => void
	value: string | undefined
	id: string
}

const Text = ({ id, onChange: handleChange, value }: TextProps) => {
	return (
		<input
			defaultValue={value}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
				handleChange(e.currentTarget.value, id)
			}
		/>
	)
}

export default Text
