import { Button as ButtonTailwind } from 'ui-tailwind'
import { Button as ButtonMui } from '@mui/material'

export default function Page() {
	return (
		<main className="flex justify-center gap-3 items-center">
			<button className="bg-red-500 p-2 rounded">Default</button>
			<ButtonTailwind color='red'>Tailwind</ButtonTailwind>
			<ButtonMui className="bg-indigo-700 text-white hover:bg-indigo-600" variant="contained">Mui</ButtonMui>
		</main>
	)
}
