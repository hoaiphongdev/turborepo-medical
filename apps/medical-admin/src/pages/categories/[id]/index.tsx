import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import AddNewProductFormContainer from '@core/components/table/AddNewProductFormContainer'

const NewProductPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Tạo sản phẩm mới 🙌"></CardHeader>
          <CardContent>
            <AddNewProductFormContainer />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default NewProductPage
