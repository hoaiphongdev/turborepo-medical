// ** React Imports
import { useState, ElementType, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from 'hooks/useAuth'
import { FormHelperText } from '@mui/material'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { isEmpty } from 'lodash'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

interface FormData {
  // email: string
  firstName: string
  lastName: string
  dateOfBirth?: string
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const AccountSettingPage = () => {
  // ** State
  const { user } = useAuth()
  const [updating, setUpdating] = useState<boolean>(false)

  const schema = yup.object().shape({
    // email: yup.string().email('Email không đúng định dạng').required('Email không được trống'),
    firstName: yup.string().required('Tên không được trống'),
    lastName: yup.string().required('Họ không được trống'),
    dateOfBirth: yup.string()
  })

  const defaultValues: FormData = {
    // email: user?.email as string,
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    dateOfBirth: isEmpty(user?.dateOfBirth) ? '' : dayjs(user?.dateOfBirth).format('YYYY-MM-DD')
  }

  const [inputValue, setInputValue] = useState<string>('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string>(user?.avatar ?? '/images/avatars/1.png')

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(schema) })

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])
      setAvatarFile(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    setUpdating(true)

    let userAvatar = user?.avatar ?? null
    if (!isEmpty(userAvatar) && avatarFile != null) {
      await axios.post(`${api.CLOUD}/delete-image`, {
        url: userAvatar as string
      })
    }

    if (avatarFile) {
      const formData = new FormData()
      // @ts-ignore
      formData.append('image', avatarFile)
      // @ts-ignore
      formData.append('width', 128)
      // @ts-ignore
      formData.append('height', 128)
      const responseUpload = await axios.post(`${api.CLOUD}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      userAvatar = responseUpload.data.data
    }

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      avatar: userAvatar
    }
    try {
      const responseUpdate = await axios.post(`${api.AUTH}/update-account`, payload)
      const userdata = responseUpdate.data.data
      localStorage.setItem('userData', JSON.stringify(userdata))
      toast.success('Cập nhật thông tin tài khoản thành công', {
        id: 'success-update-account'
      })
    } catch (error) {
      toast.error('Server đang bận, vui lòng thử lại sau!', {
        id: 'error-update-account'
      })
    }

    setUpdating(false)
  }

  // const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
  //     setFormData({ ...formData, [field]: value })
  // }

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Account Details" />
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt="Profile Pic" />
                <div>
                  <ButtonStyled
                    disabled={updating}
                    component="label"
                    variant="contained"
                    htmlFor="account-settings-upload-image"
                  >
                    Tải avatar mới
                    <input
                      hidden
                      type="file"
                      value={inputValue}
                      accept="image/png, image/jpeg"
                      onChange={handleInputImageChange}
                      id="account-settings-upload-image"
                    />
                  </ButtonStyled>
                  <Typography sx={{ mt: 5, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
                </div>
              </Box>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <TextField disabled fullWidth label="Email" placeholder="admin@materialize.com" value={user?.email} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField fullWidth type="date" onBlur={onBlur} onChange={onChange} value={value} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField fullWidth label="Họ" onBlur={onBlur} onChange={onChange} value={value} />
                    )}
                  />
                  {errors.lastName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField fullWidth label="Tên" onBlur={onBlur} onChange={onChange} value={value} />
                    )}
                  />
                  {errors.firstName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button disabled={updating} type="submit" variant="contained" sx={{ mr: 3 }}>
                    Lưu thay đổi
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AccountSettingPage
