import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Switch,
  TextField,
  Typography,
  TypographyProps,
  styled
} from '@mui/material'
import React, { useState } from 'react'
import Select from '@mui/material/Select'
// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'
import { convertToRaw } from 'draft-js'
import { useDropzone } from 'react-dropzone'
import { Icon } from '@iconify/react'
import DropzoneWrapper from '@core/styles/libs/react-dropzone'
import toast from 'react-hot-toast'
//
import draftToHtml from 'draftjs-to-html'

const ReactDraftWysiwyg = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false
})
interface FileProp {
  name: string
  type: string
  size: number
}
const AddNewProductFormContainer = () => {
  const [files, setFiles] = useState<File[]>([])
  const schema = yup.object().shape({
    name: yup.string().required('Không được bỏ trống tên sản phẩm'),
    skuProduct: yup.string().required('Không được bỏ trống mã SKU'),
    category: yup.string().required('Không được bỏ trống danh mục sản phẩm'),
    price: yup
      .number()
      .required('Không được bỏ trống giá sản phẩm')
      .min(1, 'Giá thấp nhất là 1')
      .typeError('Không được bỏ trống giá sản phẩm'),
    productDiscountPrice: yup
      .number()
      .min(1, 'Giá thấp nhất là 1')
      .required('Không được bỏ trống giá sản phẩm')
      .lessThan(yup.ref('price'), 'Giá giảm không được lớn hơn và bằng giá gốc')
      .typeError('Giá thấp nhất là 1'),
    // avatar: yup.mixed().test('fileType', 'Ảnh sản phẩm không hợp lệ', (value) => {
    //   // @ts-ignore
    //   if (!value || !value[0]) {
    //     return true
    //   }
    //   const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    //   // @ts-ignore
    //   const extension = value[0].name.split('.').pop()?.toLowerCase()
    //   return extension ? allowedExtensions.includes(extension) : false
    // }),
    inStock: yup.boolean(),
    desc: yup.object()
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
    formState: { errors }
  } = useForm({
    // defaultValues,
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
  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon="mdi:file-document-outline" />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      desc: draftToHtml(convertToRaw(data.desc.getCurrentContent()))
    }
    console.log('payload', payload)
  }
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
              <InputLabel error={Boolean(errors.category)} id="select-product-category">
                Danh mục
              </InputLabel>
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <Select
                      //   multiple
                      value={field.value}
                      error={Boolean(errors.category)}
                      onChange={(e) => field.onChange(e.target.value)}
                      id="form-layouts-separator-multiple-select"
                      labelId="select-product-category"
                      input={<OutlinedInput label="category" id="select-multiple-category" />}
                    >
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="French">French</MenuItem>
                      <MenuItem value="Spanish">Spanish</MenuItem>
                      <MenuItem value="Portuguese">Portuguese</MenuItem>
                      <MenuItem value="Italian">Italian</MenuItem>
                      <MenuItem value="German">German</MenuItem>
                      <MenuItem value="Arabic">Arabic</MenuItem>
                    </Select>
                  )
                }}
              />

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
                name="skuProduct"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label="Mã SKU"
                    onChange={onChange}
                    placeholder="Ex: SKU1101122220"
                    error={Boolean(errors.skuProduct)}
                    aria-describedby="validation-schema-skuProduct"
                  />
                )}
              />
              {errors.skuProduct && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-skuProduct">
                  {errors.skuProduct.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <Controller
                name="desc"
                control={control}
                render={({ field }) => {
                  return (
                    <Card variant="outlined">
                      <CardContent>
                        <ReactDraftWysiwyg
                          editorState={field.value as any} // wire up the value
                          onEditorStateChange={field.onChange} // send data with the onChagne
                        />
                      </CardContent>
                    </Card>
                  )
                }}
              />
              {errors.desc && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-desc">
                  {errors.desc.message}
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
                            <Typography className="file-name">{file.name}</Typography>
                            <Typography className="file-size" variant="body2">
                              {Math.round(file.size / 100) / 10 > 1000
                                ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                                : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                            </Typography>
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
                name="price"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type="number"
                    value={value}
                    label="Giá gốc"
                    onChange={onChange}
                    placeholder="Ex: 50000"
                    error={Boolean(errors.price)}
                    aria-describedby="validation-schema-price"
                  />
                )}
              />
              {errors.price && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-price">
                  {errors.price.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="productDiscountPrice"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type="number"
                    value={value}
                    label="Giá giảm (giá bán chính thức)"
                    onChange={onChange}
                    placeholder="Ex: 25000"
                    error={Boolean(errors.productDiscountPrice)}
                    aria-describedby="validation-schema-productDiscountPrice"
                  />
                )}
              />
              {errors.productDiscountPrice && (
                <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-productDiscountPrice">
                  {errors.productDiscountPrice.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="inStock"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  sx={{
                    marginLeft: 0
                  }}
                  label="Sản phẩm còn hàng: "
                  labelPlacement="start"
                  control={<Switch value={value} onChange={onChange} />}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button size="large" type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default AddNewProductFormContainer
