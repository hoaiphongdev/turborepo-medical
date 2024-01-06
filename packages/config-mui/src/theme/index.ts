import { Mode, Skin, ThemeColor } from '../types'
// ** MUI Theme Provider
import { deepmerge } from '@mui/utils'
import { PaletteMode, ThemeOptions } from '@mui/material'

// ** Theme Override Imports
import palette from './palette'
import spacing from './spacing'
import shadows from './shadows'
import overrides from './overrides'
import typography from './typography'
import breakpoints from './breakpoints'

export type themeProps = {
  skin: Skin
  mode: Mode
  themeColor: ThemeColor
}

export const themeOption = (themeProps: themeProps, overrideMode: PaletteMode): ThemeOptions => {
  // ** Vars
  const { skin, mode, themeColor } = themeProps

  // ** Create New object before removing user component overrides and typography objects from userThemeOptions

  const themedConfig: ThemeOptions = {
    breakpoints: breakpoints(),
    components: overrides(themeProps),
    palette: palette(mode === 'semi-dark' ? overrideMode : mode, skin),
    ...spacing,
    shape: {
      borderRadius: 10
    },
    mixins: {
      toolbar: {
        minHeight: 64
      }
    },
    shadows: shadows(mode === 'semi-dark' ? overrideMode : mode),
    typography
  }

  return deepmerge(themedConfig, {
    palette: {
      primary: {
        ...(themedConfig.palette
          ? themedConfig.palette[themeColor]
          : palette(mode === 'semi-dark' ? overrideMode : mode, skin).primary)
      }
    }
  })
}
