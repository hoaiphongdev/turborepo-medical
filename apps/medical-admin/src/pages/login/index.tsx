// ** React Imports
import { ReactNode, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from '@core/components/icon'

// ** Configs
import themeConfig from 'configs/themeConfig'

// ** Layout Import
import BlankLayout from '@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'views/pages/auth/FooterIllustrationsV1'
import MedicalIcon from '@core/components/medical-icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from 'hooks/useAuth'
import { FormHelperText, useTheme } from '@mui/material'

import toast from 'react-hot-toast'

const schema = yup.object().shape({
  email: yup.string().email('Email không đúng định dạng').required('Email không được trống'),
  password: yup.string().required('Mật khẩu không được trống')
})

const defaultValues = {
  password: '123456',
  email: 'dev.meidcal@gmail.com'
}

interface FormData {
  email: string
  password: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}))

const LoginPage = () => {
  const auth = useAuth()
  const theme = useTheme()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  // const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    // setIsLoading(true)
    if (isLoading || isSubmitting) return
    const { email, password } = data
    auth.login({ email, password }, (error) => {
      // @ts-ignore
      const message = error?.response?.data?.message ?? 'Server đang bận, vui lòng thử lại sau.'

      return toast.success(message, {
        id: 'error-login',
        style: {
          padding: '16px',
          color: theme.palette.error.light,
          border: `1px solid ${theme.palette.error}`
        },
        iconTheme: {
          primary: theme.palette.error.light,
          secondary: theme.palette.primary.contrastText
        }
      })
    })
  }

  return (
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: (theme) => `${theme.spacing(13, 7, 6.5)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MedicalIcon />
            <Typography variant="h6" sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
              {`Mừng bạn trở lại với ${themeConfig.templateName}! 👋🏻`}
            </Typography>
            <Typography variant="body2">Đăng nhập vào tài khoản của bạn</Typography>
          </Box>

          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label="Email"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder="admin@materialize.com"
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="auth-login-v2-password" error={Boolean(errors.password)}>
                Mật khẩu
              </InputLabel>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label="Password"
                    onChange={onChange}
                    id="auth-login-v2-password"
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id="">
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading || isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ my: 7 }}
            >
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true
LoginPage.authGuard = false

export default LoginPage
