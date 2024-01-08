// ** MUI Imports
import Grid from '@mui/material/Grid'
import TableProductList from '@core/components/table/TableProductList'

const Products = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableProductList />
      </Grid>
    </Grid>
  )
}

export default Products
