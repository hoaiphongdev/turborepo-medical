// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from '@core/components/icon'

// ** Types
import { ThemeColor } from 'config-mui'

// ** Custom Components Imports
import CustomAvatar from '@core/components/mui/avatar'

interface SaleDataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const salesData: SaleDataType[] = [
  {
    stats: '52',
    color: 'primary',
    title: 'Nhà thuốc/Bệnh viện',
    icon: <Icon icon="mdi:account-outline" />
  },
  {
    stats: '672',
    color: 'warning',
    title: 'Sản phẩm',
    icon: <Icon icon="mdi:poll" />
  },
  {
    color: 'info',
    stats: '20',
    title: 'Danh mục',
    icon: <Icon icon="mdi:trending-up" />
  }
]

const renderStats = () => {
  return salesData.map((sale: SaleDataType, index: number) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin="light" variant="rounded" color={sale.color} sx={{ mr: 4 }}>
          {sale.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {sale.stats}
          </Typography>
          <Typography variant="caption">{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const EcommerceSalesOverview = () => {
  return (
    <Card>
      <CardHeader
        sx={{ pb: 3.25 }}
        title="Tổng quan"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Grid container spacing={6}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceSalesOverview
