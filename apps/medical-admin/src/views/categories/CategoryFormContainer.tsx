import { Box, FormControl, FormHelperText, Grid, TextField, Typography, styled } from '@mui/material'

import Button, { ButtonProps } from '@mui/material/Button'

import React, { useState, ElementType, ChangeEvent } from 'react'
// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'
import toast from 'react-hot-toast'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

interface FormData {
  name: string
  description?: string
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  objectFit: 'cover',
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

export type CategoryFormContainerProps = {
  categoryId?: string
  name?: string
  description?: string
  image?: string
  isCreate?: boolean
}

const CategoryFormContainer = (props: CategoryFormContainerProps) => {
  const { categoryId = null, name = '', description = '', image = '', isCreate = true } = props

  const schema = yup.object().shape({
    name: yup.string().required('Không được bỏ trống tên danh mục'),
    description: yup.string()
  })

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name,
      description
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const [inputValue, setInputValue] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imgSrc, setImgSrc] = useState<string>(isEmpty(image) ? '/images/cards/amazon-echo-dot.png' : image)

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])
      setImageFile(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true)

    let imageUrl = null
    if (imageFile) {
      const formData = new FormData()
      // @ts-ignore
      formData.append('image', imageFile)
      // @ts-ignore
      formData.append('width', 128)
      // @ts-ignore
      formData.append('height', 128)
      const responseUpload = await axios.post(`${api.CLOUD}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      imageUrl = responseUpload.data.data
    }

    const payload = {
      name: data.name,
      description: data.description,
      image: imageUrl
    }
    try {
      let message = ''
      if (isCreate) {
        message = 'Thêm danh mục thành công'
        await axios.post(`${api.CATEGORY}`, payload)
      } else {
        message = 'Chỉnh sửa danh mục thành công'
        await axios.put(`${api.CATEGORY}/${categoryId}`, payload)
      }

      router.replace('/categories', undefined, { shallow: false })
      toast.success(message, { id: 'success-process-category' })
      setIsProcessing(false)
    } catch (error) {
      toast.error('Server đang bận, vui lòng thử lại sau!', {
        id: 'error-add-category'
      })
    }

    setIsProcessing(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: '12px' }}>
            Thông tin danh mục
          </Typography>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label="Tên danh mục (*)"
                    onChange={onChange}
                    placeholder="Ex: Donut, Drug, etc.."
                    error={Boolean(errors.name)}
                    aria-describedby="validation-schema-name"
                  />
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                  {errors.name.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label="Mô tả danh mục"
                    onChange={onChange}
                    placeholder="Type something awesome here ✌️"
                    error={Boolean(errors.description)}
                    aria-describedby="validation-schema-description"
                  />
                )}
              />
              {errors.description && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-description">
                  {errors.description.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt="image category" />
              <div>
                <ButtonStyled
                  disabled={isProcessing}
                  component="label"
                  variant="contained"
                  htmlFor="account-settings-upload-image"
                >
                  Tải ảnh mới
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
          </Grid>
          <Grid item xs={12}>
            <Button disabled={isProcessing} size="large" type="submit" variant="contained">
              Lưu
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default CategoryFormContainer
