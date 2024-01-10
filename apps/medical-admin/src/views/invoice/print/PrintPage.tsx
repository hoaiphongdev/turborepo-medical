// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'

// ** Configs
import themeConfig from 'configs/themeConfig'
import MedicalIcon from '@core/components/medical-icon'
import { formatCurrencyVND } from 'core'
import dayjs from 'dayjs'

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

type InvoicePrintPage = {
  invoiceData?: any
}

const InvoicePrintPage = ({ invoiceData }: InvoicePrintPage) => {
  // ** Hooks
  const theme = useTheme()

  useEffect(() => {
    const timout = setTimeout(() => {
      window.print()
    }, 100)

    return () => {
      clearTimeout(timout)
    }
  }, [])

  if (invoiceData) {
    // const { invoice, paymentDetails } = invoiceData

    return (
      <Box sx={{ p: 12, pb: 6 }}>
        <Grid container>
          <Grid item xs={8} sx={{ mb: { sm: 0, xs: 4 } }}>
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
                  TP Hồ Chí Minh, 700000
                </Typography>
                <Typography variant="body2">+1 (123) 456 7891, +44 (876) 543 2198</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end', xs: 'flex-start' } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {`Hóa đơn #${invoiceData.poNumber}`}
              </Typography>
              <Box sx={{ mb: 2, display: 'flex' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Ngày phát hành:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {dayjs(invoiceData.dateIssues).format('YYYY-MM-DD')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Ngày thanh toán:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {dayjs(invoiceData.paidAt).format('YYYY-MM-DD')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: (theme) => `${theme.spacing(6)} !important` }} />

        <Grid container>
          <Grid item xs={7} md={8} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant="body2" sx={{ mb: 3.5, fontWeight: 600 }}>
              Hóa đơn cho:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {invoiceData?.customerInformation.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {invoiceData?.customerInformation.email}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {invoiceData?.shippingAddress.line1}, {invoiceData?.shippingAddress.line2},{' '}
              {invoiceData?.shippingAddress.city}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {invoiceData.customerInformation?.phone}
            </Typography>
          </Grid>
          <Grid item xs={5} md={4}>
            <Typography variant="body2" sx={{ mb: 3.5, fontWeight: 600 }}>
              Thanh toán cho:
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <MUITableCell>Ngân hàng:</MUITableCell>
                  <MUITableCell>Vietcombank</MUITableCell>
                </TableRow>
                <TableRow>
                  <MUITableCell>Quốc gia:</MUITableCell>
                  <MUITableCell>Việt Nam</MUITableCell>
                </TableRow>
                <TableRow>
                  <MUITableCell>IBAN:</MUITableCell>
                  <MUITableCell>ETD95476213874685</MUITableCell>
                </TableRow>
                <TableRow>
                  <MUITableCell>SWIFT code:</MUITableCell>
                  <MUITableCell>BR91905</MUITableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>

        <Divider sx={{ mt: (theme) => `${theme.spacing(6)} !important`, mb: '0 !important' }} />

        <Table sx={{ mb: 6 }}>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Tổng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceData?.invoiceItems?.map((item: any) => {
              return (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.note}</TableCell>
                  <TableCell>{formatCurrencyVND(item.price)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrencyVND(item.amount)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <Grid container>
          <Grid item xs={4} sm={5} lg={3}>
            <CalcWrapper>
              <Typography variant="body2">Tạm tính:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatCurrencyVND(invoiceData?.subTotal ?? 0)}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2">Tax:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Comming soon
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2">Vận chuyển:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Comming soon
              </Typography>
            </CalcWrapper>
            <Divider />
            <CalcWrapper>
              <Typography variant="body2">Tổng hóa đơn:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatCurrencyVND(invoiceData?.total ?? 0)}
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>

        <Divider sx={{ my: `${theme.spacing(6)} !important` }} />
        <Typography variant="body2">
          <strong>Ghi chú:</strong> Đây là một niềm vinh dự khi được việc với bạn và tổ chức của bạn. Chúng tôi hy vọng
          bạn sẽ ghi nhớ chúng tôi và các dự án trong tương lai. Cảm ơn bạn!
        </Typography>
      </Box>
    )
  } else
    return (
      <Box sx={{ p: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity="error">
              Có vẻ như quán trình in hóa đơn đã bị gián đoạn, bạn vui lòng chọn lại hóa đơn cần in tại
              <Link href="/invoice">đây</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    )
}

export default InvoicePrintPage
