import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'

interface DefaultLayoutProps {
	children: ReactNode
}

const EmptyLayout = (props: DefaultLayoutProps) => {
	const {children} = props
	return (
		<React.Fragment>
			{children}
		</React.Fragment>
	)
}

export default EmptyLayout

EmptyLayout.propTypes = {
	children: PropTypes.node.isRequired
}
