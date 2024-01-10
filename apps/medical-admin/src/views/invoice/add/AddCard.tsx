// ** React Imports
import { useState, forwardRef, ForwardedRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box, { BoxProps } from '@mui/material/Box'
import Grid, { GridProps } from '@mui/material/Grid'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import { Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from '@core/components/icon'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Configs
import themeConfig from 'configs/themeConfig'

import MedicalIcon from '@core/components/medical-icon'
import { FormHelperText } from '@mui/material'
import SelectProduct from './SelectProduct'
import { formatCurrencyVND } from 'core'
import { isEmpty } from 'lodash'
import { calculatorPrice } from 'pages/invoice/create-invoice'

interface PickerProps {
  label?: string
}

interface Props {
  isProcessing: boolean
  invoiceItems: Array<any>
  setInvoiceItems: (arr: Array<any>) => void
  control: any
  errors: any
}

const CustomInput = forwardRef(({ ...props }: PickerProps, ref: ForwardedRef<HTMLElement>) => {
  return (
    <TextField
      size="small"
      inputRef={ref}
      sx={{ width: { sm: '250px', xs: '170px' }, '& .MuiInputBase-input': { color: 'text.secondary' } }}
      {...props}
    />
  )
})

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const RepeatingContent = styled(Grid)<GridProps>(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-1.5rem',
    position: 'absolute'
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary
  },
  [theme.breakpoints.down('lg')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)<CardContentProps>(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(5.5),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(12)
  }
}))

const InvoiceAction = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const AddCard = (props: Props) => {
  const { isProcessing = false, control, errors, invoiceItems, setInvoiceItems } = props

  // const [invoiceItems, setInvoiceItems] = useState<Array<any>>([])

  const handleSelectProduct = (invoiceUIId: string, product: any) => {
    if(isProcessing) return
    const invoiceItemIndex = invoiceItems.findIndex((x: any) => x.id === invoiceUIId)

    const temp = [...invoiceItems]
    temp[invoiceItemIndex] = {
      id: invoiceUIId,
      productId: product._id,
      name: product?.name,
      price: product?.salePrice,
      quantity: 1,
      amount: product?.salePrice * 1,
      discountPercentage: 0,
      note: ''
    }

    setInvoiceItems(temp)
  }

  const handleChangeQuantity = (invoiceUIId: string, quantity: any) => {
    if(isProcessing) return
    const invoiceItemIndex = invoiceItems.findIndex((x: any) => x.id === invoiceUIId)
    let requantity = isEmpty(quantity.trim()) ? 1 : quantity
    const temp = [...invoiceItems]

    temp[invoiceItemIndex] = {
      ...temp[invoiceItemIndex],
      quantity: parseInt(requantity),
      amount: temp[invoiceItemIndex].price * parseInt(requantity)
    }

    setInvoiceItems(temp)
  }

  const handleChangeNote = (invoiceUIId: string, note: string) => {
    if(isProcessing) return
    const invoiceItemIndex = invoiceItems.findIndex((x: any) => x.id === invoiceUIId)
    const temp = [...invoiceItems]

    temp[invoiceItemIndex] = {
      ...temp[invoiceItemIndex],
      note
    }

    setInvoiceItems(temp)
  }

  const handleRemoveInvoiceItem = (invoiceUIId: string) => {
    if (isProcessing) return

    const temp = [...invoiceItems].filter((x: any) => x.id !== invoiceUIId)
    setInvoiceItems(temp)
  }

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                <MedicalIcon />
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <div>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  236B Lê Văn Sỹ, Phường 1, Quận Tân Bình
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  TP. Hồ Chí Minh, 700000, Việt Nam
                </Typography>
                <Typography variant="body2">+1 (123) 456 7891, +44 (876) 543 2198</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xl={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 2, width: '200px' }}>
                  Ngày phát hành:
                </Typography>
                <Grid item xs={12}>
                  <Controller
                    name="dateIssues"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        id="issue-date"
                        minDate={new Date()}
                        selected={value}
                        customInput={<CustomInput />}
                        onChange={onChange}
                      />
                    )}
                  />
                  {errors.dateIssues && (
                    <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                      {errors.dateIssues.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="body2" sx={{ mr: 2, width: '200px' }}>
                  Ngày thanh toán:
                </Typography>
                <Grid item xs={12}>
                  <Controller
                    name="paidAt"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker id="due-date" selected={value} customInput={<CustomInput />} onChange={onChange} />
                    )}
                  />
                  {errors.paidAt && (
                    <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                      {errors.paidAt.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: (theme) => `${theme.spacing(1)} !important` }} />

      <CardContent sx={{ pb: 2 }}>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={8} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant="subtitle2" sx={{ mb: 3, color: 'text.primary' }}>
              Hóa đơn cho:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="customerName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Tên khách hàng (*)"
                      value={value ?? ''}
                      onChange={onChange}
                      placeholder="Nhà thuốc pharmacy"
                    />
                  )}
                />
                {errors.customerName && (
                  <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                    {errors.customerName.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="customerEmail"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Email khách hàng (*)"
                      value={value ?? ''}
                      onChange={onChange}
                      placeholder="pharmacy@gmail.com"
                    />
                  )}
                />
                {errors.customerEmail && (
                  <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                    {errors.customerEmail.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: ['flex-start'] }}>
            <div>
              <Typography variant="subtitle2" sx={{ mb: 2.5, color: 'text.primary' }}>
                Thanh toán cho:
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant="body2">Bank name:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="body2">Vietcombank</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant="body2">Country:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="body2">Việt Nam</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant="body2">IBAN:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="body2">ETD95476213874685</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant="body2">SWIFT code:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="body2">BR91905</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ mb: (theme) => `${theme.spacing(1.25)} !important` }} />

      <RepeaterWrapper>
        {invoiceItems.map((item: any, idx: number) => {
          const Tag = idx === 0 ? Box : Collapse
          return (
            <Tag key={idx} className="repeater-wrapper" {...(idx !== 0 ? { in: true } : {})}>
              <Grid container>
                <RepeatingContent item xs={12}>
                  <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                    <Grid item lg={6} md={5} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                      <Typography
                        variant="subtitle2"
                        className="col-title"
                        sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                      >
                        Sản phẩm
                      </Typography>
                      <SelectProduct
                        productId={item.productId}
                        invoiceUIId={item.id}
                        handleSelectProduct={handleSelectProduct}
                        exceptIds={invoiceItems.map((item: any) => {
                          return item?.productId as string
                        })}
                      />
                      <TextField
                        rows={2}
                        fullWidth
                        multiline
                        size="small"
                        sx={{ mt: 3.5 }}
                        value={item?.note ?? ''}
                        onChange={(e) => handleChangeNote(item?.id, e.target.value)}
                      />
                    </Grid>
                    <Grid item lg={2} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                      <Typography
                        variant="subtitle2"
                        className="col-title"
                        sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                      >
                        Đơn giá
                      </Typography>
                      <TextField
                        disabled
                        size="small"
                        value={formatCurrencyVND(item.price ?? 0)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item lg={2} md={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                      <Typography
                        variant="subtitle2"
                        className="col-title"
                        sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                      >
                        Số lượng
                      </Typography>
                      <TextField
                        size="small"
                        type="number"
                        placeholder="1"
                        defaultValue="1"
                        value={item?.quantity}
                        onChange={(e) => handleChangeQuantity(item.id, e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item lg={2} md={1} xs={12} sx={{ px: 4, my: { lg: 0 }, mt: 2 }}>
                      <Typography
                        variant="subtitle2"
                        className="col-title"
                        sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                      >
                        Tổng cộng
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrencyVND(item.amount ?? 0)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <InvoiceAction onClick={() => handleRemoveInvoiceItem(item?.id)}>
                    <IconButton size="small">
                      <Icon icon="mdi:close" fontSize={20} />
                    </IconButton>
                  </InvoiceAction>
                </RepeatingContent>
              </Grid>
            </Tag>
          )
        })}
        <Grid container sx={{ mt: 4.75 }}>
          <Grid item xs={12} sx={{ px: 0 }}>
            <Button
              disabled={isProcessing}
              size="small"
              variant="contained"
              startIcon={<Icon icon="mdi:plus" fontSize={20} />}
              onClick={() =>
                setInvoiceItems([
                  ...invoiceItems,
                  {
                    id: crypto.randomUUID(),
                    productId: '',
                    name: '',
                    price: 0,
                    quantity: 1,
                    amount: 0,
                    discountPercentage: 0,
                    note: ''
                  }
                ])
              }
            >
              Thêm sản phẩm
            </Button>
          </Grid>
        </Grid>
      </RepeaterWrapper>

      <Divider />

      <CardContent>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={7} sx={{ order: { sm: 1, xs: 2 } }}></Grid>
          <Grid item xs={12} sm={5} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapper>
              <Typography variant="body2" fontWeight="600">
                Tạm tính:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                {formatCurrencyVND(calculatorPrice(invoiceItems) ?? 0)}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2" fontWeight="600">
                Tax:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: '.25px' }}>
                Comming soon
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2" fontWeight="600">
                Vận chuyển:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: '.25px' }}>
                Comming soon
              </Typography>
            </CalcWrapper>
            <Divider
              sx={{
                mt: (theme) => `${theme.spacing(6)} !important`,
                mb: (theme) => `${theme.spacing(1.5)} !important`
              }}
            />
            <CalcWrapper>
              <Typography variant="body2" fontWeight="900">
                Tổng hóa đơn:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                {formatCurrencyVND(calculatorPrice(invoiceItems) ?? 0)}
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: (theme) => `${theme.spacing(1)} !important` }} />

      <CardContent sx={{ pt: 4 }}>
        <InputLabel htmlFor="invoice-note">Note:</InputLabel>
        <Controller
          name="customerNote"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              rows={2}
              fullWidth
              multiline
              value={value}
              onChange={onChange}
              id="invoice-note"
              sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
              defaultValue="Thank for your bussiness 💘"
            />
          )}
        />
      </CardContent>
    </Card>
  )
}

export default AddCard
