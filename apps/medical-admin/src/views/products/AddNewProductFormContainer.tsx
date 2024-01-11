import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  List,
  ListItem,
  Switch,
  TextField,
  Typography,
  TypographyProps,
  styled
} from '@mui/material'
import React, { useState } from 'react'
// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'
import { useDropzone } from 'react-dropzone'
import { Icon } from '@iconify/react'
import DropzoneWrapper from '@core/styles/libs/react-dropzone'
import toast from 'react-hot-toast'
import { api } from 'configs/api.endpoint'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

interface FileProp {
  name: string
  type: string
  size: number
}
type Props = {
  categoryId?: string
  imageList?: Array<any>
  isEdit?: boolean
  productId?: any
  defaultValues?: {
    name: string
    category: string
    quantity: number
    basePrice: number
    salePrice: number
    inStock?: boolean
    status?: boolean
    description?: string
  }
}
const AddNewProductFormContainer = (props: Props) => {
  const { defaultValues, imageList = [], isEdit = false, productId } = props
  const [files, setFiles] = useState<File[]>(imageList)
  const [categories, setCategories] = useState([])
  const router = useRouter()
  const schema = yup.object().shape({
    name: yup.string().required('Không được bỏ trống tên sản phẩm'),
    category: yup.string().required('Không được bỏ trống danh mục sản phẩm'),
    basePrice: yup
      .number()
      .required('Không được bỏ trống giá sản phẩm')
      .min(1, 'Giá thấp nhất là 1')
      .typeError('Không được bỏ trống giá sản phẩm'),
    salePrice: yup
      .number()
      .min(1, 'Giá thấp nhất là 1')
      .required('Không được bỏ trống giá sản phẩm')
      .lessThan(yup.ref('basePrice'), 'Giá giảm không được lớn hơn và bằng giá gốc')
      .typeError('Giá thấp nhất là 1'),
    inStock: yup.boolean(),
    status: yup.boolean(),
    description: yup.string()
  })
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 2,
    maxSize: 2000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('You can only upload 2 files & maximum size of 2 MB.', {
        duration: 2000
      })
    }
  })
  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  // Styled component for the upload image inside the dropzone area // NO IMPORTANT -- JUST UI
  const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
      width: 250
    }
  }))
  // Styled component for the heading inside the dropzone area // NO IMPORTANT -- JUST UI
  const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(4)
    }
  }))
  const renderFilePreview = (file: any) => {
    if (file?.type?.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else if (typeof file === 'string' && isEdit) {
      return <img width={38} height={38} alt={file} src={file} />
    } else {
      return <Icon icon="mdi:file-document-outline" />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const onSubmit = async (data: any) => {
    let imageUrl = null
    if (files) {
      const formData = new FormData()
      formData.append('image', files[0])
      formData.append('width', '128')
      formData.append('height', '128')
      try {
        const responseUpload = await axios.post(`${api.CLOUD}/upload-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        imageUrl = responseUpload.data.data
      } catch (error) {
        console.error('Error uploading image:', error)
        // Handle error as needed
      }
    }

    const payload = {
      ...data,
      quantity: 1,
      images: imageUrl ?? [],
      status: data?.status ? 'publish' : 'draft'
    }
    try {
      let message = ''
      let createProduct
      if (!isEdit) {
        message = 'Tạo sản phẩm thành công'
        createProduct = await axios.post(`${api.PRODUCT}`, payload)
      } else {
        message = 'Chỉnh sửa sản phẩm thành công'
        createProduct = await axios.put(`${api.PRODUCT}/${productId}`, payload)
      }
      // const createProduct = await axios.post(`${api.PRODUCT}`, payload)
      if (createProduct?.data?.isSuccess) {
        toast.success(message, { id: 'success-process-category' })
        router.replace('/products', undefined, { shallow: false })
      }
    } catch (error) {
      toast.error('Server đang bận, vui lòng thử lại sau!', {
        id: 'error-add-category'
      })
    }
  }

  const { isLoading } = useQuery({
    queryKey: ['get-categories'],
    queryFn: async () => {
      const response = await axios.get(`${api.CATEGORY}`)
      setCategories(response?.data?.data?.records)
    }
  })

  if (isLoading) return <Typography variant="body1">Loading</Typography>
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: '12px' }}>
            1. Thông tin sản phẩm
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
                    label="Tên sản phẩm"
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
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      fullWidth
                      disablePortal
                      id="combo-box-demo"
                      options={categories}
                      sx={{ width: '100%' }} // Chắc chắn đặt width là '100%'
                      getOptionLabel={(option: any) => option.name} // Lấy giá trị hiển thị từ đối tượng
                      renderInput={(params) => <TextField {...params} label="Danh mục" />}
                      value={categories.find((item: any) => item._id === field.value) || null}
                      onChange={(_, newValue) => field.onChange(newValue ? newValue._id : null)}
                    />
                  )
                }}
              />
              {/* <Controller
                name="category" // Tên của field trong form
                control={control}
                // defaultValue={''} // Giá trị mặc định của SelectCategory
                render={({ field }) => (
                  <SelectCategory
                    categoryId={categoryId}
                    handleSelectCategory={(selectedCategory) => field.onChange(selectedCategory?._id)}
                  />
                )}
              /> */}

              {errors.category && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-category">
                  {errors.category.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      value={value}
                      label="Mô tả sản phẩm"
                      onChange={onChange}
                      placeholder="1200"
                      error={Boolean(errors.description)}
                      aria-describedby="validation-schema-description"
                    />
                  )
                }}
              />
              {errors.description && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-description">
                  {errors.description.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <DropzoneWrapper>
              <Grid xs={12} spacing={6} className="match-height">
                <Grid item xs={12}>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                      <Img width={300} alt="Upload img" src="/images/misc/upload.png" />
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}
                      >
                        <HeadingTypography variant="h5">Drop files here or click to upload.</HeadingTypography>
                        <Typography color="textSecondary">Allowed *.jpeg, *.jpg, *.png, *.gif</Typography>
                      </Box>
                    </Box>
                  </div>
                  <List>
                    {files.map((file: FileProp) => (
                      <ListItem key={file.name}>
                        <div className="file-details">
                          <div className="file-preview">{renderFilePreview(file)}</div>
                          <div>
                            <Typography className="file-name">{file.name ?? file}</Typography>
                            {!isEdit && (
                              <Typography className="file-size" variant="body2">
                                {Math.round(file.size / 100) / 10 > 1000
                                  ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                                  : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                              </Typography>
                            )}
                          </div>
                        </div>
                        <IconButton onClick={() => handleRemoveFile(file)}>
                          <Icon icon="mdi:close" fontSize={20} />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </DropzoneWrapper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              2. Giá sản phẩm
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="basePrice"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type="number"
                    value={value}
                    label="Giá gốc"
                    onChange={onChange}
                    placeholder="Ex: 50000"
                    error={Boolean(errors.basePrice)}
                    aria-describedby="validation-schema-basePrice"
                  />
                )}
              />
              {errors.basePrice && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-basePrice">
                  {errors.basePrice.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="salePrice"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type="number"
                    value={value}
                    label="Giá giảm (giá bán chính thức)"
                    onChange={onChange}
                    placeholder="Ex: 25000"
                    error={Boolean(errors.salePrice)}
                    aria-describedby="validation-schema-salePrice"
                  />
                )}
              />
              {errors.salePrice && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-salePrice">
                  {errors.salePrice.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="inStock"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <FormControlLabel
                    sx={{
                      marginLeft: 0
                    }}
                    label="Sản phẩm còn hàng: "
                    labelPlacement="start"
                    control={<Switch defaultChecked={value} value={value} onChange={onChange} />}
                  />
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="status"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  sx={{
                    marginLeft: 0
                  }}
                  label="Publish sản phẩm: "
                  labelPlacement="start"
                  control={<Switch defaultChecked={value} value={value} onChange={onChange} />}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button disabled={isSubmitting} size="large" type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default AddNewProductFormContainer
