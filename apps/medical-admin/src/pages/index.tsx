// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import CardStatisticsCharacter from '@core/components/card-statistics/card-stats-with-image'

// ** Styled Component Import
import KeenSliderWrapper from '@core/styles/libs/keen-slider'
import ApexChartWrapper from '@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import EcommerceTotalVisits from 'views/dashboards/ecommerce/EcommerceTotalVisits'
import EcommerceSalesOverview from 'views/dashboards/ecommerce/EcommerceSalesOverview'
import EcommerceWeeklySalesBg from 'views/dashboards/ecommerce/EcommerceWeeklySalesBg'
import EcommerceSalesThisMonth from 'views/dashboards/ecommerce/EcommerceSalesThisMonth'
import EcommerceActivityTimeline from 'views/dashboards/ecommerce/EcommerceActivityTimeline'
import EcommerceSalesOverviewWithTabs from 'views/dashboards/ecommerce/EcommerceSalesOverviewWithTabs'
const EcommerceDashboard = () => {
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12} md={6}>
            <EcommerceSalesOverview />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              showAction={false}
              data={{
                id: '1221',
                stats: '8.14k',
                title: 'Lượt phản hồi',
                chipColor: 'primary',
                trendNumber: 'tích cực',
                chipText: 'Năm 2023',
                src: '/images/cards/card-stats-img-1.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              showAction={false}
              data={{
                id: '122',
                stats: 'Giảm',
                trend: 'negative',
                title: 'Lượng liên hệ hợp tác',
                chipColor: 'success',
                trendNumber: '-2%',
                chipText: 'Tháng vừa rồi',
                src: '/images/cards/card-stats-img-2.png'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <EcommerceWeeklySalesBg />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <EcommerceTotalVisits />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <EcommerceSalesThisMonth />
          </Grid>
          <Grid item xs={12} md={6}>
            <EcommerceActivityTimeline />
          </Grid>
          <Grid item xs={12} md={6}>
            <EcommerceSalesOverviewWithTabs />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default EcommerceDashboard
