import { createContext, useState, ReactNode, useEffect } from 'react'
import themeConfig from 'configs/themeConfig'
import { Skin, Mode, ThemeColor } from 'config-mui'

export type Settings = {
  skin: Skin
  mode: Mode
  themeColor: ThemeColor
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

const initialSettings: Settings = {
  themeColor: 'success',
  mode: themeConfig.mode,
  skin: themeConfig.skin,
  toastPosition: themeConfig.toastPosition
}

const staticSettings = {
  toastPosition: initialSettings.toastPosition
}

export type PageSpecificSettings = {
  skin?: Skin
  mode?: Mode
  themeColor?: ThemeColor
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

export type SettingsContextValue = {
  settings: Settings
  saveSettings: (updatedSettings: Settings) => void
}

interface SettingsProviderProps {
  children: ReactNode
  pageSettings?: PageSpecificSettings | void
}

const restoreSettings = (): Settings | null => {
  let settings = null

  try {
    const storedData: string | null = window.localStorage.getItem('settings')

    if (storedData) {
      settings = { ...JSON.parse(storedData), ...staticSettings }
    } else {
      settings = initialSettings
    }
  } catch (err) {
    console.error(err)
  }

  return settings
}

// set settings in localStorage
const storeSettings = (settings: Settings) => {
  const initSettings = Object.assign({}, settings)

  delete initSettings.toastPosition
  window.localStorage.setItem('settings', JSON.stringify(initSettings))
}

// ** Create Context
export const SettingsContext = createContext<SettingsContextValue>({
  saveSettings: () => null,
  settings: initialSettings
})

export const SettingsProvider = ({ children, pageSettings }: SettingsProviderProps) => {
  // ** State
  const [settings, setSettings] = useState<Settings>({ ...initialSettings })

  useEffect(() => {
    const restoredSettings = restoreSettings()

    if (restoredSettings) {
      setSettings({ ...restoredSettings })
    }
    if (pageSettings) {
      setSettings({ ...settings, ...pageSettings })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSettings])

  const saveSettings = (updatedSettings: Settings) => {
    storeSettings(updatedSettings)
    setSettings(updatedSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const SettingsConsumer = SettingsContext.Consumer
