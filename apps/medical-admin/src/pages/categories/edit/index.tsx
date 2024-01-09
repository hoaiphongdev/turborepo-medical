import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import AddNewCategoryFormContainer from 'views/categories/CategoryFormContainer'

const NewCategoryPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Tạo danh mục mới 😊"></CardHeader>
          <CardContent>
            <AddNewCategoryFormContainer />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default NewCategoryPage
