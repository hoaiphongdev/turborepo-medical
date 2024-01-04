import React, { ReactNode, useCallback, useState } from 'react'
import { createRoot } from 'react-dom/client'

interface ModalProps {
	children: ReactNode
	modalStyle?: string
	childStyle?: string
	textConfirm?: string
	textCancel?: string
	styleButton?: string
	onCancel: () => void
	onConfirm: () => void
}

const Modal: React.FC<ModalProps> = (props) => {
	console.log('props', props)
	return (
		<div>
			{/* TODO MODAL*/}
		</div>
	)
}

interface UseModalConfirmResult {
	isOpen: boolean
	isConfirmed: boolean | null
	// GUIDE:  Render UI theo thứ tự các params này
	openModal: (
		renderUI: () => React.ReactNode,
		textCancel?: string | undefined,
		textConfirm?: string | undefined
	) => Promise<boolean>
}

export const useModalConfirm = (): UseModalConfirmResult => {
	const [isOpen, setIsOpen] = useState(false)
	const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null)

	const openModal = useCallback(
		(
			renderUI: () => React.ReactNode,
			textCancel?: string | undefined,
			textConfirm?: string | undefined
		): Promise<boolean> => {
			return new Promise<boolean>((resolve) => {
				const onCancel = () => {
					setIsOpen(false)
					setIsConfirmed(false)
					cleanup()
					resolve(false)
				}

				const onConfirm = () => {
					setIsOpen(false)
					setIsConfirmed(true)
					cleanup()
					resolve(true)
				}

				const cleanup = () => {
					const modalContainer = document.getElementById('modal-container')
					modalContainer?.remove()
				}

				const modalUI = (
					<Modal
						textCancel={textCancel}
						textConfirm={textConfirm}
						onCancel={onCancel}
						onConfirm={onConfirm}>
						{renderUI()}
					</Modal>
				)

				setIsOpen(true)

				const modalRoot = document.getElementById('modal-root')
				const modalContainer = document.createElement('div')
				modalContainer.id = 'modal-container'
				modalRoot?.appendChild(modalContainer)

				const root = createRoot(modalContainer)
				root.render(modalUI)
			})
		},
		[]
	)

	return { isOpen, isConfirmed, openModal }
}
