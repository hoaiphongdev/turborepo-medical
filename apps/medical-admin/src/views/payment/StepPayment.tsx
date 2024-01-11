// ** React Imports
import { useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import AlertTitle from '@mui/material/AlertTitle'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components Imports
import CustomChip from '@core/components/mui/chip'

// ** Icon Imports
import Icon from '@core/components/icon'
import { formatCurrencyVND } from 'core'
import { FormHelperText } from '@mui/material'
import dayjs from 'dayjs'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import toast from 'react-hot-toast'

export interface FormData {
  numberCard: string
  nameCard: string
  expiredDate?: string
  cvc: string
}
const StepPayment = ({ handleNext, invoiceData }: { handleNext: () => void; invoiceData: any }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const schema = yup.object().shape({
    numberCard: yup.string().required('Số thẻ không được bỏ trống'),
    nameCard: yup.string().required('Tên in trên thẻ không được bỏ trống'),
    expiredDate: yup.string().required('Ngày hết hạn không được bỏ trống'),
    cvc: yup.string().min(3, 'CVC không hợp lệ').required('CVC không được bỏ trống')
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      numberCard: '4456530000001096',
      nameCard: 'tommy shelby',
      expiredDate: '12/28',
      cvc: '123'
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema)
  })

  const onSubmit = async () => {
    setIsProcessing(true)

    const payload = {
      salePerson: 'Medical',
      customerNode: invoiceData.customerNote,
      status: 'payment_due',
      vatNumber: invoiceData?.taxNumber,
      priceType: invoiceData?.taxInclude,
      dateIssues: dayjs(invoiceData.dateIssues).format('YYYY-MM-DD'),
      paidOn: dayjs().format('YYYY-MM-DD'),
      paidAt: dayjs(invoiceData.paidAt).format('YYYY-MM-DD'),
      amountPaid: invoiceData?.amountPaid, // Số tiền đã thanh toán
      amountDue: 0, // Số tiền còn lại phải thanh toán
      subTotal: invoiceData?.subTotal,
      total: invoiceData.total,
      tax: 0,
      shippingFee: 0,
      invoiceItems: invoiceData?.invoiceItems.map(
        ({ name, price, quantity, amount, discountPercentage, note }: any) => {
          return {
            name,
            price,
            quantity,
            amount,
            discountPercentage,
            note
          }
        }
      ),
      paymentMethod: 'credit_card',
      billingBank: {
        bankName: 'Vietcombank',
        country: 'Việt Nam',
        iban: '',
        swiftCode: '',
        accountNumber: '10153474380',
        accountName: 'Medical'
      },
      billingAddress: {
        name: 'Medical',
        email: 'medical@gmail.com',
        phone: '0123 456 789',
        country: 'Việt Nam',
        city: 'TP Hồ Chí Minh',
        state: 'TP Hồ Chí Minh',
        stateCode: 'HCM',
        zip: 70000,
        line1: 'Phường 1, Quận Tân Bình',
        line2: '236B Lê Văn Sỹ, Quận Tân Bình,'
      },
      shippingAddress: {
        name: invoiceData?.customerInformation.name,
        email: invoiceData?.customerInformation.email,
        phone: invoiceData?.shippingAddress.phone,
        country: 'Việt Nam',
        city: invoiceData?.shippingAddress?.city,
        state: invoiceData?.shippingAddress?.state,
        stateCode: invoiceData?.shippingAddress?.stateCode,
        zip: invoiceData?.shippingAddress?.zip,
        line1: invoiceData?.shippingAddress?.line1,
        line2: invoiceData?.shippingAddress?.line2
      },
      customerInformation: {
        name: invoiceData?.customerInformation?.name,
        email: invoiceData?.customerInformation?.email,
        avatar: invoiceData?.customerInformation?.avatar
      }
    }
    try {
      await axios.put(`${api.INVOICE}/${invoiceData._id}`, payload)
      handleNext()
    } catch (error) {
      toast.error('Server đang bận, vui lòng thử lại sau', {
        id: 'error-payment-print-invoice'
      })
    }

    setIsProcessing(false)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={8}>
        <Alert severity="info" icon={<Icon icon="mdi:tag-outline" />} sx={{ mb: 6 }}>
          <AlertTitle>Thông tin thanh toán</AlertTitle>
          <div>
            <Typography sx={{ color: 'info.main' }}>- MasterCard, VISA, JCB</Typography>
            <Typography sx={{ color: 'info.main' }}>- Giảm 10% khi thanh toán bằng thẻ</Typography>
            <Typography sx={{ color: 'info.main' }}>
              - Hóa đơn tự động cập nhật mà không cần liên lạc quản trị viên
            </Typography>
          </div>
        </Alert>
        <Alert severity="error" icon={<Icon icon="mdi:note-alert-outline" />} sx={{ mb: 6 }}>
          <AlertTitle>Lưu ý</AlertTitle>
          <div>
            <Typography sx={{ color: 'error.main' }}>
              - Medical không lưu bất kỳ thông tin thông thanh toán nào của khách hàng
            </Typography>
          </div>
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container sx={{ mt: 5 }}>
            <Grid item md={12} xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Controller
                    name="numberCard"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <TextField
                          fullWidth
                          value={value.toUpperCase()}
                          onChange={onChange}
                          label="Số in trên thẻ"
                          placeholder="0123456789"
                          error={Boolean(errors.numberCard)}
                        />
                      )
                    }}
                  />
                  {errors.numberCard && (
                    <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                      {errors.numberCard.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="nameCard"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <TextField
                          fullWidth
                          value={value.toUpperCase()}
                          onChange={onChange}
                          label="Tên trên thẻ"
                          placeholder="John Doe"
                          error={Boolean(errors.nameCard)}
                        />
                      )
                    }}
                  />
                  {errors.nameCard && (
                    <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                      {errors.nameCard.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Controller
                    name="expiredDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <TextField
                          fullWidth
                          value={value.toUpperCase()}
                          onChange={onChange}
                          label="Ngày hết hạn"
                          placeholder="123"
                          error={Boolean(errors.expiredDate)}
                        />
                      )
                    }}
                  />
                  {errors.expiredDate && (
                    <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                      {errors.expiredDate.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Controller
                    name="cvc"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <TextField
                          fullWidth
                          label="CVC"
                          placeholder="654"
                          value={value.toUpperCase()}
                          onChange={onChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                <Tooltip title="Card Verification Value">
                                  <Box component="span" sx={{ display: 'inline-flex', '& svg': { cursor: 'pointer' } }}>
                                    <Icon icon="mdi:help-circle-outline" fontSize={20} />
                                  </Box>
                                </Tooltip>
                              </InputAdornment>
                            )
                          }}
                        />
                      )
                    }}
                  />
                  {errors.expiredDate && (
                    <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                      {errors.expiredDate.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button variant="contained" sx={{ mr: 3.5 }} type="submit" disabled={isProcessing}>
                    Thanh toán ngay
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item xs={12} lg={4}>
        <Box sx={{ borderRadius: 1, border: (theme) => `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Typography sx={{ mb: 4, fontWeight: 600 }}>Chi tiết giá</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  mb: 2,
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Tạm tính
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {formatCurrencyVND(invoiceData?.subTotal ?? 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  Giảm giá
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="body2" sx={{ mr: 2, textDecoration: 'line-through', color: 'text.disabled' }}>
                    {formatCurrencyVND(invoiceData?.subTotal * 0.1)}
                  </Typography>
                  <CustomChip size="small" skin="light" color="success" label="10%" />
                </Box>
              </Box>
            </Box>
          </CardContent>
          <Divider sx={{ my: '0 !important' }} />
          <CardContent>
            <Box
              sx={{
                mb: 2,
                gap: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>Tổng hóa đơn</Typography>
              <Typography>{formatCurrencyVND(invoiceData.total - invoiceData?.subTotal * 0.1)}</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600 }}>{invoiceData?.customerInformation?.name}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>{invoiceData?.customerInformation?.email}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>{invoiceData?.shippingAddress?.line1}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {invoiceData?.shippingAddress?.line2}, {invoiceData?.shippingAddress?.city}{' '}
            </Typography>
            <Typography sx={{ mb: 4, color: 'text.secondary' }}>SĐT : {invoiceData?.shippingAddress?.phone}</Typography>
          </CardContent>
        </Box>
      </Grid>
    </Grid>
  )
}

export default StepPayment
