import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CategoryFormContainer, { CategoryFormContainerProps } from 'views/categories/CategoryFormContainer'
import { isEmpty } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { Typography } from '@mui/material'
import { notFound } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const EditCategoryPage = () => {
  const { query } = useRouter()
  const categoryId = query['id']

  const { isLoading, data, isRefetching, refetch } = useQuery({
    queryKey: ['get-category-edit', categoryId],
    queryFn: async () => {
      if (!categoryId) return notFound()
      const response = await axios.get(`${api.CATEGORY}/${categoryId}`)

      return { ...response.data.data, categoryId: response.data.data._id } as CategoryFormContainerProps
    }
  })

  useEffect(() => {
    if (!isRefetching) refetch()
  }, [categoryId])

  if (isLoading || isRefetching) return <Typography variant="body1">Loading</Typography>

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Điều chỉnh danh mục 😦"></CardHeader>
          <CardContent>
            <CategoryFormContainer
              isCreate={false}
              categoryId={data?.categoryId}
              name={data?.name}
              description={data?.description}
              image={data?.image}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export const getInitialProps = async (context: any) => {
  const { query } = context

  if (!query) {
    return { notFound: true }
  }
  const categoryId = query['id'] as string

  if (isEmpty(categoryId)) {
    return { notFound: true }
  }

  return { notFound: true }
}

export default EditCategoryPage
