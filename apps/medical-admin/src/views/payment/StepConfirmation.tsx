// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import List, { ListProps } from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'

// ** Custom Components Imports
import CustomChip from '@core/components/mui/chip'

// ** Icon Imports
import Icon from '@core/components/icon'
import dayjs from 'dayjs'
import { formatCurrencyVND } from 'core'

const StyledList = styled(List)<ListProps>(({ theme }) => ({
  padding: 0,
  '& .MuiListItem-root': {
    padding: theme.spacing(5),
    border: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6
    },
    '&:last-of-type': {
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6
    },
    '&:not(:last-of-type)': {
      borderBottom: 0
    },
    '& .MuiListItemText-root': {
      marginTop: 0,
      marginBottom: theme.spacing(4),
      '& .MuiTypography-root': {
        fontWeight: 500
      }
    },
    '& .remove-item': {
      top: '0.5rem',
      right: '0.625rem',
      position: 'absolute',
      color: theme.palette.text.disabled
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  }
}))

const HorizontalList = styled(List)<ListProps>(({ theme }) => ({
  padding: 0,
  display: 'flex',
  borderRadius: 6,
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiListItem-root': {
    padding: theme.spacing(5),
    '&:not(:last-of-type)': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  },
  [theme.breakpoints.down('md')]: {
    display: 'block',
    '& .MuiListItem-root': {
      '&:not(:last-of-type)': {
        borderRight: 0,
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  }
}))

const StepConfirmation = ({ invoiceData }: { invoiceData: any }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Thank You! 😇
          </Typography>
          <Typography sx={{ mb: 4, color: 'text.secondary' }}>
            Hóa đơn{' '}
            <Box
              href="/"
              component={Link}
              onClick={(e) => e.preventDefault()}
              sx={{ color: 'primary.main', textDecoration: 'none' }}
            >
              #${invoiceData.poNumber}
            </Box>{' '}
            đã được thanh toán
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ ml: 1.5, color: 'text.secondary' }}>
              Ngày phát hành: {dayjs(invoiceData.dateIssues).format('YYYY-MM-DD')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ ml: 1.5, color: 'text.secondary' }}>
              Ngày thanh toán: {dayjs(invoiceData.paidOn).format('YYYY-MM-DD')}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <HorizontalList>
          <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1.5, display: 'flex' }}>
                <Icon icon="mdi:map-marker-outline" fontSize={20} />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>Thông tin khách hàng</Typography>
            </Box>
            <Typography sx={{ color: 'text.secondary' }}>{invoiceData.customerInformation.name}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>{invoiceData.customerInformation.email}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>{invoiceData.shippingAddress.line1}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {invoiceData.shippingAddress.line2}, {invoiceData.shippingAddress.city}
            </Typography>
            <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
              SDT: {invoiceData.shippingAddress.phone}
            </Typography>
          </ListItem>
          <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1.5, display: 'flex' }}>
                <Icon icon="mdi:credit-card-outline" fontSize={20} />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>Thông tin đối tác</Typography>
            </Box>
            <Typography sx={{ color: 'text.secondary' }}>{invoiceData.billingAddress.name}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>{invoiceData.billingAddress.email}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>{invoiceData.billingAddress.line1}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {invoiceData.billingAddress.line2}, {invoiceData.billingAddress.city}
            </Typography>
            <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {invoiceData.billingAddress.phone}
            </Typography>
          </ListItem>
          <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1.5, display: 'flex' }}>
                <Icon icon="mdi:archive-outline" fontSize={20} />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>Vận chuyển</Typography>
            </Box>
            <Typography sx={{ mb: 4, fontWeight: 600, color: 'text.secondary' }}>Comming soon</Typography>
          </ListItem>
        </HorizontalList>
      </Grid>
      <Grid item xs={12} md={8} xl={9}>
        <StyledList>
          {invoiceData.invoiceItems.map((item: any) => {
            return (
              <ListItem key={item._id}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={8}>
                    <ListItemText primary={item.name} />
                    <Box sx={{ display: 'flex' }}>
                      <Typography sx={{ mr: 2, color: 'text.secondary' }}>Đơn giá</Typography>
                      <Typography
                        href="/"
                        component={Link}
                        onClick={(e) => e.preventDefault()}
                        sx={{ mr: 4, color: 'primary.main', textDecoration: 'none' }}
                      >
                        {formatCurrencyVND(item.price)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <Typography sx={{ mr: 2, color: 'text.secondary' }}>Số lượng</Typography>
                      <Typography
                        href="/"
                        component={Link}
                        onClick={(e) => e.preventDefault()}
                        sx={{ mr: 4, color: 'primary.main', textDecoration: 'none' }}
                      >
                        {item.quantity}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    xs={12}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
                  >
                    <Typography sx={{ color: 'primary.main' }}>{formatCurrencyVND(item.amount)}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
            )
          })}
        </StyledList>
      </Grid>
      <Grid item xs={12} md={4} xl={3}>
        <Box sx={{ mb: 4, borderRadius: 1, border: (theme) => `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Typography sx={{ mb: 4, fontWeight: 600 }}>Chi tiết hóa đơn</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  mb: 4,
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  Tạm tính
                </Typography>
                <Typography variant="body2">{formatCurrencyVND(invoiceData?.subTotal ?? 0)}</Typography>
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
          <Divider sx={{ m: '0 !important' }} />
          <CardContent sx={{ py: (theme) => `${theme.spacing(3.5)} !important` }}>
            <Box
              sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography sx={{ fontWeight: 600 }}>Tổng hóa đơn</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {formatCurrencyVND(invoiceData.total - invoiceData?.subTotal * 0.1)}
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </Grid>
    </Grid>
  )
}

export default StepConfirmation
