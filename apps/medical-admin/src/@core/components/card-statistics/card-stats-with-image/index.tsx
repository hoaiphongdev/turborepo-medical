// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
// ** MUI Imports
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from '@core/components/icon'
// ** Custom Components Imports
import CustomChip from '@core/components/mui/chip'

// ** Types Imports
import { CartStats } from 'views/categories/ListCardCategories'
import { useRouter } from 'next/router'

interface Props {
  data: CartStats
}

const CardStatsCharacter = ({ data }: Props) => {
  // ** Vars
  const { id, title, chipText, src, stats, trendNumber, trend = 'positive', chipColor = 'primary' } = data
  const router = useRouter()

  return (
    <Card sx={{ overflow: 'visible', position: 'relative' }}>
      <CardContent sx={{ pb: '0 !important' }}>
        <Grid container>
          <Grid item xs={6}>
            <Typography sx={{ mb: 1.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{title}</Typography>
            <CustomChip
              skin="light"
              size="small"
              label={chipText}
              color={chipColor}
              sx={{ mb: 5.5, height: 20, fontWeight: 500, fontSize: '0.75rem' }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1.5 }}>
                {stats}
              </Typography>
              <Typography variant="caption" sx={{ color: trend === 'negative' ? 'error.main' : 'success.main' }}>
                {trendNumber}
              </Typography>
            </Box>
            <IconButton
              aria-label="capture screenshot"
              onClick={() => {
                router.push(`/categories/edit/${id}`, undefined, { shallow: false })
              }}
            >
              <Icon icon="mdi:edit" />
            </IconButton>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <img src={src} alt={title} height={134} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardStatsCharacter
