import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { isEmpty } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { Typography } from '@mui/material'
import { notFound } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import AddNewProductFormContainer from 'views/products/AddNewProductFormContainer'

const EditProductPage = () => {
  const { query } = useRouter()
  const productId = query['id']

  const { isLoading, data, isRefetching, refetch } = useQuery({
    queryKey: ['get-product-edit', productId],
    queryFn: async () => {
      if (!productId) return notFound()
      const response = await axios.get(`${api.PRODUCT}/${productId}`)
      return { ...response.data.data, productId: response.data.data._id }
    }
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  if (isLoading || isRefetching) return <Typography variant="body1">Loading</Typography>
  const defaultValues = {
    name: data?.name,
    quantity: data?.quantity,
    category: data?.category?._id,
    basePrice: data?.basePrice,
    salePrice: data?.salePrice,
    inStock: data?.inStock,
    description: data?.description,
    status: data?.status === 'publish' ? true : false
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Cập nhật sản phẩm 💉"></CardHeader>
          <CardContent>
            <AddNewProductFormContainer
              productId={productId}
              isEdit
              categoryId={data?.category?._id}
              imageList={data?.images}
              defaultValues={defaultValues}
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
  const productId = query['id'] as string

  if (isEmpty(productId)) {
    return { notFound: true }
  }

  return { notFound: true }
}

export default EditProductPage
