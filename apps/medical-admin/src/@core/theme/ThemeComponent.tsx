// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import {
	ThemeProvider,
	createTheme,
	responsiveFontSizes
} from '@mui/material/styles'

// ** Type Imports
import { Settings } from '@core/context/settingsContext'

// ** Theme Config
import themeConfig from 'configs/themeConfig'

// ** Direction component for LTR or RTL
import Direction from 'layouts/components/Direction'

// ** Theme
// import themeOptions from './ThemeOptions'
import { themeOption } from 'config-mui'

// ** Global Styles
import GlobalStyling from './globalStyles'
import { PaletteMode, ThemeOptions } from '@mui/material'
import { deepmerge } from '@mui/utils'

interface Props {
	settings: Settings
	children: ReactNode
}

const ThemeComponent = (props: Props) => {
	const { settings, children } = props

	const mergedThemeOption = (mysetting: Settings, overrideMode: PaletteMode): ThemeOptions => deepmerge(
		{
			direction: mysetting.direction
		},
		themeOption(settings, overrideMode)
	)

	let theme = createTheme(mergedThemeOption(settings, 'light'))

	if(themeConfig.responsiveFontSizes) {
		theme = responsiveFontSizes(theme)
	}

	return (
		<ThemeProvider theme={theme}>
			<Direction direction={settings.direction}>
				<CssBaseline/>
				<GlobalStyles styles={() => GlobalStyling(theme) as any}/>
				{children}
			</Direction>
		</ThemeProvider>
	)
}

export default ThemeComponent
