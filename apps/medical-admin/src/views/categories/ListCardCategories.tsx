// ** Next Imports
import { InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
// ** Type Import
import { CardStatsCharacterProps } from '@core/components/card-statistics/types'

// ** Custom Components Imports
import CardStatisticsCharacter from '@core/components/card-statistics/card-stats-with-image'

export type CartStats = {
    id: string
} & CardStatsCharacterProps

type ListCardCategoriesProps = {
  categories: Array<CartStats>
}
const ListCardCategories = (props: ListCardCategoriesProps) => {
  const { categories } = props

  return (
    <Grid item xs={12}>
      <Grid container spacing={6}>
        {categories.map((item: CartStats) => {
          return (
            <Grid key={item.id} item xs={12} sm={6} lg={3}>
              <CardStatisticsCharacter data={item} />
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}

export default ListCardCategories
