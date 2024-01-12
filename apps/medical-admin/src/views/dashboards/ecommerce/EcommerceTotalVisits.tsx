// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components Imports
import CustomAvatar from '@core/components/mui/avatar'

// ** Icon Imports
import Icon from '@core/components/icon'

const EcommerceTotalVisits = () => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 6.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2">Hoá đơn đã thanh toán</Typography>
            <Typography variant="h6">2.223.675.000đ</Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                skin="light"
                color="warning"
                variant="rounded"
                sx={{ mr: 1.5, height: 24, width: 24, borderRadius: '6px' }}
              >
                <Icon icon="mdi:cellphone" fontSize="0.875rem" />
              </CustomAvatar>
              <Typography variant="body2">Chờ thanh toán</Typography>
            </Box>
            <Typography variant="h6">892.321.112đ</Typography>
          </Box>
          <Divider flexItem sx={{ m: 0 }} orientation="vertical">
            <CustomAvatar
              skin="light"
              color="secondary"
              sx={{ height: 24, width: 24, fontSize: '0.6875rem', color: 'text.secondary' }}
            >
              VS
            </CustomAvatar>
          </Divider>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 1.5 }} variant="body2">
                Đã thanh toán
              </Typography>
              <CustomAvatar skin="light" variant="rounded" sx={{ height: 24, width: 24, borderRadius: '6px' }}>
                <Icon icon="mdi:monitor" fontSize="0.875rem" />
              </CustomAvatar>
            </Box>
            <Typography variant="h6">1.478.212.210đ</Typography>
          </Box>
        </Box>
        <LinearProgress
          value={24}
          variant="determinate"
          sx={{
            height: 10,
            '&.MuiLinearProgress-colorPrimary': { backgroundColor: 'primary.main' },
            '& .MuiLinearProgress-bar': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: 'warning.main'
            }
          }}
        />
      </CardContent>
    </Card>
  )
}

export default EcommerceTotalVisits
