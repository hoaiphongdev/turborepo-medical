import { Box, CardContent, Divider, FormHelperText, Grid, TextField, Typography, styled } from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { isEmpty } from 'lodash'
import { useState, ElementType, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Button, { ButtonProps } from '@mui/material/Button'

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

export type FormDataClient = {
  email: string
  name: string
  taxNumber: string
  phone: string
  city: string
  state: string
  stateCode: string
  zip: string
  line1?: string
  line2?: string
}

type FormEditClientType = {
  client: any
  clientAvatar?: string
}

const FormEditClient = (props: FormEditClientType) => {
  const { client, clientAvatar } = props

  const [updating, setUpdating] = useState<boolean>(false)
  const router = useRouter()

  const schema = yup.object().shape({
    email: yup.string().email('Email không đúng định dạng').required('Email không được trống'),
    name: yup.string().required('Tên khách hàng (bệnh viện) không được trống'),
    taxNumber: yup.string().required('Mã số thuế không được trống'),
    phone: yup.string().required('Số điện thoại khách hàng không được trống'),
    city: yup.string().required('Thành phố không được trống'),
    state: yup.string().required('Tỉnh thành không được trống'),
    stateCode: yup.string().required('Mã tỉnh thành không được trống'),
    zip: yup.string().required('Mã bưu điện không được trống'),
    line1: yup.string(),
    line2: yup.string()
  })

  const defaultValues: FormDataClient = {
    email: client?.email ?? '',
    name: client?.name ?? '',
    phone: client?.phone ?? '',
    taxNumber: client?.taxNumber ?? '',
    city: client?.shippingAddress.city ?? '',
    state: client?.shippingAddress?.state ?? '',
    stateCode: client?.shippingAddress?.stateCode ?? '',
    zip: client?.shippingAddress?.zip ?? '',
    line1: client?.shippingAddress?.line1 ?? '',
    line2: client?.shippingAddress?.line2 ?? ''
  }

  const [inputValue, setInputValue] = useState<string>('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string>(
    isEmpty(clientAvatar) ? '/images/banners/banner-30.jpg' : (clientAvatar as string)
  )

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty }
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

  const onSubmit = async (data: FormDataClient) => {
    setUpdating(true)

    let tempAvatar = clientAvatar ?? null
    if (!isEmpty(clientAvatar) && avatarFile != null) {
      await axios.post(`${api.CLOUD}/delete-image`, {
        url: clientAvatar as string
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
      tempAvatar = responseUpload.data.data
    }

    const payload = {
      clientId: client._id,
      email: data.email,
      name: data.name,
      password: '123456',
      vatNumber: '',
      taxNumber: data.taxNumber,
      phone: data.phone,
      avatar: tempAvatar,
      shippingAddress: {
        country: 'Việt Nam',
        city: data.city,
        state: data.state,
        stateCode: data.stateCode,
        zip: data.zip,
        line1: data.line1,
        line2: data.line2
      }
    }
    try {
      const responseUpdate = await axios.put(`${api.CLIENT}/${client._id}`, payload)
      const userdata = responseUpdate.data.data
      localStorage.setItem('userData', JSON.stringify(userdata))
      toast.success('Điều chỉnh tài khoản khách hàng thành công 💘', {
        id: 'success-add-client'
      })
      router.replace('/client', undefined, { shallow: false })
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Server đang bận, vui lòng thử lại sau!'
      toast.error(message, {
        id: 'error-add-client'
      })
    }

    setUpdating(false)
  }

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ImgStyled src={imgSrc} alt="client image" />
          <div>
            <ButtonStyled
              disabled={updating}
              component="label"
              variant="contained"
              htmlFor="account-settings-upload-image"
            >
              Tải ảnh đại mới cho khách hàng
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
        <Typography variant="body1" sx={{ ml: 1, my: 4 }}>
          1. Thông tin chung
        </Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Email khách hàng (nhà thuốc/bệnh viện)(*)"
                  placeholder="EX: hospital.playlist@gmail.com"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Tên khách hàng (nhà thuốc/bệnh viện)(*)"
                  placeholder="EX: Hospital playlist"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Số điện thoại(*)"
                  placeholder="EX: 0123 456 789"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="taxNumber"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Mã số thuế(*)"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.taxNumber)}
                />
              )}
            />
            {errors.taxNumber && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.taxNumber.message}</FormHelperText>
            )}
          </Grid>
        </Grid>

        <Typography variant="body1" sx={{ ml: 1, my: 4 }}>
          2. Thông tin địa chỉ
        </Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="city"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Thành phố(*)"
                  placeholder="EX: TP Hồ Chí Minh"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.city)}
                />
              )}
            />
            {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="state"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Tỉnh thành(*)"
                  placeholder="EX: TP Hồ Chí Minh"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.state)}
                />
              )}
            />
            {errors.state && <FormHelperText sx={{ color: 'error.main' }}>{errors.state.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="zip"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Mã bưu điện(*)"
                  placeholder="EX: 700000"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.zip)}
                />
              )}
            />
            {errors.zip && <FormHelperText sx={{ color: 'error.main' }}>{errors.zip.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="stateCode"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Mã tỉnh thành(*)"
                  placeholder="EX: HCM"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.stateCode)}
                />
              )}
            />
            {errors.stateCode && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.stateCode.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="line1"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Địa chỉ 1"
                  placeholder="5 Ward, Bình Thành Disctrict"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.zip)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="line2"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Địa chỉ 2"
                  placeholder="123 Street, Apt 5"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.stateCode)}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container sx={{ my: 6 }}>
          <Grid item xs={12}>
            <Button disabled={updating || !isDirty} type="submit" variant="contained" sx={{ mr: 3 }}>
              Lưu thông tin khách hàng
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </form>
  )
}

export default FormEditClient
