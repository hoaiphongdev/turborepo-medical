import { Skin, Mode } from 'config-mui'

type ThemeConfig = {
  skin: Skin
  mode: Mode
  templateName: string
  routingLoader: boolean
  toastPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

const themeConfig: ThemeConfig = {
  // ** Layout Configs
  templateName: 'Medical' /* App Name */,
  mode: 'light' as Mode /* light | dark | semi-dark /*! Note: semi-dark value will only work for Vertical Layout */,
  skin: 'default' /* default | bordered */,
  routingLoader: true /* true | false */,
  toastPosition: 'top-right' /* top-left | top-center | top-right | bottom-left | bottom-center | bottom-right */
}

export default themeConfig
