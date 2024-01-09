// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from '@core/components/icon'

// ** Type Import
import { Settings } from '@core/context/settingsContext'

// ** Components
import UserDropdown from '@core/layouts/components/shared-components/UserDropdown'
import ShortcutsDropdown, { ShortcutsType } from '@core/layouts/components/shared-components/ShortcutsDropdown'

// ** Hook Import
import { useAuth } from 'hooks/useAuth'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const shortcuts: ShortcutsType[] = [
  {
    title: 'Dashboard',
    url: '/',
    subtitle: 'Trang chủ',
    icon: 'mdi:calendar-month-outline'
  },
  {
    title: 'Product',
    url: '/products',
    subtitle: 'Quản lý sản phẩm',
    icon: 'mdi:receipt-text-outline'
  },
  {
    title: 'Category',
    url: '/categories',
    subtitle: 'Quản lý danh mục',
    icon: 'mdi:account-outline'
  },
  {
    url: '/invoice',
    title: 'Invoice',
    subtitle: 'Quản lý hóa đơn',
    icon: 'mdi:shield-check-outline'
  }
]

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, toggleNavVisibility } = props

  // ** Hook
  const auth = useAuth()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className="actions-left" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color="inherit" sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon="mdi:menu" />
          </IconButton>
        ) : null}
        {/* {auth.user && <Autocomplete hidden={hidden} settings={settings} />} */}
      </Box>
      <Box className="actions-right" sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
        {auth.user && (
          <>
            <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />
            <UserDropdown settings={settings} />
          </>
        )}
      </Box>
    </Box>
  )
}

export default AppBarContent
