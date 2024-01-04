// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Type Import
import { LayoutProps } from '@core/layouts/types'

// ** Custom Icon Import
import Icon from '@core/components/icon'

// ** Configs
import themeConfig from 'configs/themeConfig'

interface Props {
  navHover: boolean
  collapsedNavWidth: number
  hidden: LayoutProps['hidden']
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  navMenuBranding?: LayoutProps['verticalLayoutProps']['navMenu']['branding']
  menuLockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['lockedIcon']
  menuUnlockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['unlockedIcon']
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.spacing(4),
  justifyContent: 'space-between',
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)<TypographyProps>({
  fontWeight: 700,
  lineHeight: 1.2,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
})

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const { mode, direction, navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const svgFillSecondary = () => {
    if (mode === 'semi-dark') {
      return `rgba(${theme.palette.customColors.dark}, 0.6)`
    } else {
      return theme.palette.text.secondary
    }
  }
  const svgFillDisabled = () => {
    if (mode === 'semi-dark') {
      return `rgba(${theme.palette.customColors.dark}, 0.38)`
    } else {
      return theme.palette.text.disabled
    }
  }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 40) / 8
      }
    } else {
      return 5.5
    }
  }

  const svgRotationDeg = () => {
    if (navCollapsed) {
      if (direction === 'rtl') {
        if (navHover) {
          return 0
        } else {
          return 180
        }
      } else {
        if (navHover) {
          return 180
        } else {
          return 0
        }
      }
    } else {
      if (direction === 'rtl') {
        return 180
      } else {
        return 0
      }
    }
  }

  return (
    <MenuHeaderWrapper className="nav-header" sx={{ pl: menuHeaderPaddingLeft() }}>
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <LinkStyled href="/">
          <svg width="40" height="40" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_17)">
              <path
                d="M26.0192 7C42.0962 -2.28203 61.9038 -2.28203 77.9808 7C94.0577 16.282 103.962 33.4359 103.962 52C103.962 70.5641 94.0577 87.718 77.9808 97C61.9038 106.282 42.0962 106.282 26.0192 97C9.94229 87.718 0.038475 70.5641 0.038475 52C0.038475 33.4359 9.94229 16.282 26.0192 7Z"
                fill="black"
                fill-opacity="0.64"
              />
              <path
                d="M26.0192 7C42.0962 -2.28203 61.9038 -2.28203 77.9808 7C94.0577 16.282 103.962 33.4359 103.962 52C103.962 70.5641 94.0577 87.718 77.9808 97C61.9038 106.282 42.0962 106.282 26.0192 97C9.94229 87.718 0.038475 70.5641 0.038475 52C0.038475 33.4359 9.94229 16.282 26.0192 7Z"
                fill="url(#paint0_linear_1_17)"
                fill-opacity="0.15"
              />
              <path
                d="M26.0192 7C42.0962 -2.28203 61.9038 -2.28203 77.9808 7C94.0577 16.282 103.962 33.4359 103.962 52C103.962 70.5641 94.0577 87.718 77.9808 97C61.9038 106.282 42.0962 106.282 26.0192 97C9.94229 87.718 0.038475 70.5641 0.038475 52C0.038475 33.4359 9.94229 16.282 26.0192 7Z"
                fill="black"
                fill-opacity="0.5"
              />
              <path
                d="M0.538475 52C0.538475 33.6146 10.347 16.6257 26.2692 7.43301C42.1915 -1.7597 61.8085 -1.7597 77.7308 7.43301C93.653 16.6257 103.462 33.6146 103.462 52C103.462 70.3854 93.653 87.3743 77.7308 96.567C61.8085 105.76 42.1915 105.76 26.2692 96.567C10.347 87.3743 0.538475 70.3854 0.538475 52Z"
                stroke="url(#paint1_radial_1_17)"
                stroke-opacity="0.15"
              />
              <path
                d="M0.538475 52C0.538475 33.6146 10.347 16.6257 26.2692 7.43301C42.1915 -1.7597 61.8085 -1.7597 77.7308 7.43301C93.653 16.6257 103.462 33.6146 103.462 52C103.462 70.3854 93.653 87.3743 77.7308 96.567C61.8085 105.76 42.1915 105.76 26.2692 96.567C10.347 87.3743 0.538475 70.3854 0.538475 52Z"
                stroke="url(#paint2_linear_1_17)"
                stroke-opacity="0.5"
              />
              <path
                d="M51.8878 37.9262C44.1892 37.9262 37.9258 44.1896 37.9258 51.8882C37.9258 59.5868 44.1892 65.8502 51.8878 65.8502C59.5864 65.8502 65.8498 59.5868 65.8498 51.8882C65.8498 44.1896 59.5864 37.9262 51.8878 37.9262ZM51.8878 59.1136C47.8968 59.1136 44.6624 55.8792 44.6624 51.8882C44.6624 47.8972 47.8968 44.6628 51.8878 44.6628C55.8788 44.6628 59.1132 47.8972 59.1132 51.8882C59.1132 55.8792 55.8788 59.1136 51.8878 59.1136Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M53.0581 35.633V30.42C64.3889 31.0258 73.3901 40.4066 73.3901 51.8882C73.3901 63.3698 64.3889 72.748 53.0581 73.3564V68.1434C61.5029 67.5402 68.1901 60.4838 68.1901 51.8882C68.1901 43.2926 61.5029 36.2362 53.0581 35.633ZM39.5745 62.5482C37.3359 59.9638 35.8929 56.6722 35.6355 53.0582H30.4199C30.6903 58.1152 32.7131 62.7042 35.8825 66.2376L39.5719 62.5482H39.5745ZM50.7182 73.3564V68.1434C47.1016 67.886 43.81 66.4456 41.2256 64.2044L37.5362 67.8938C41.0722 71.0658 45.6612 73.086 50.7156 73.3564H50.7182Z"
                fill="url(#paint3_linear_1_17)"
              />
            </g>
            <defs>
              <linearGradient id="paint0_linear_1_17" x1="52" y1="-8" x2="52" y2="112" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3286F1" />
                <stop offset="1" stopColor="#C43AC4" />
              </linearGradient>
              <radialGradient
                id="paint1_radial_1_17"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(52 -7.99999) rotate(90) scale(154.286 154.286)"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" />
              </radialGradient>
              <linearGradient
                id="paint2_linear_1_17"
                x1="-8"
                y1="-8"
                x2="18.25"
                y2="40.75"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1_17"
                x1="53.9007"
                y1="33.4389"
                x2="32.7679"
                y2="54.5717"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0096FF" />
                <stop offset="1" stopColor="#FF1E56" />
              </linearGradient>
              <clipPath id="clip0_1_17">
                <rect width="104" height="104" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <HeaderTitle variant="h6" sx={{ ...menuCollapsedStyles, ...(navCollapsed && !navHover ? {} : { ml: 2 }) }}>
            {themeConfig.templateName}
          </HeaderTitle>
        </LinkStyled>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{ p: 0, backgroundColor: 'transparent !important' }}
        >
          <Icon icon="mdi:close" fontSize={20} />
        </IconButton>
      ) : userMenuLockedIcon === null && userMenuUnlockedIcon === null ? null : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{ p: 0, color: 'text.primary', backgroundColor: 'transparent !important' }}
        >
          {userMenuLockedIcon && userMenuUnlockedIcon ? (
            navCollapsed ? (
              userMenuUnlockedIcon
            ) : (
              userMenuLockedIcon
            )
          ) : (
            <Box
              width={22}
              fill="none"
              height={22}
              component="svg"
              viewBox="0 0 22 22"
              xmlns="http://www.w3.org/2000/svg"
              sx={{
                transform: `rotate(${svgRotationDeg()}deg)`,
                transition: 'transform .25s ease-in-out .35s'
              }}
            >
              <path
                fill={svgFillSecondary()}
                d="M11.4854 4.88844C11.0082 4.41121 10.2344 4.41121 9.75716 4.88844L4.51029 10.1353C4.03299 10.6126 4.03299 11.3865 4.51029 11.8638L9.75716 17.1107C10.2344 17.5879 11.0082 17.5879 11.4854 17.1107C11.9626 16.6334 11.9626 15.8597 11.4854 15.3824L7.96674 11.8638C7.48943 11.3865 7.48943 10.6126 7.96674 10.1353L11.4854 6.61667C11.9626 6.13943 11.9626 5.36568 11.4854 4.88844Z"
              />
              <path
                fill={svgFillDisabled()}
                d="M15.8683 4.88844L10.6214 10.1353C10.1441 10.6126 10.1441 11.3865 10.6214 11.8638L15.8683 17.1107C16.3455 17.5879 17.1193 17.5879 17.5965 17.1107C18.0737 16.6334 18.0737 15.8597 17.5965 15.3824L14.0779 11.8638C13.6005 11.3865 13.6005 10.6126 14.0779 10.1353L17.5965 6.61667C18.0737 6.13943 18.0737 5.36568 17.5965 4.88844C17.1193 4.41121 16.3455 4.41121 15.8683 4.88844Z"
              />
            </Box>
          )}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
