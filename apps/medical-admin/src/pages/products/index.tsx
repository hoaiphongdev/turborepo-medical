// ** MUI Imports
import TableProductListContainer from 'views/products/TableProductListContainer'
import Grid from '@mui/material/Grid'
import { useQuery } from '@tanstack/react-query'
import { api } from 'configs/api.endpoint'
import axios from 'axios'
import { useEffect } from 'react'
import { Typography } from '@mui/material'

const Products = () => {
  const { isLoading, isRefetching, data, refetch } = useQuery({
    queryKey: ['get-products'],
    queryFn: async () => {
      const response = await axios.get(`${api.PRODUCT}`)
      const result = (response?.data?.data?.records ?? []).map((item: any) => {
        return {
          ...item,
          id: item._id,
          images: item.images[0]
        }
      })
      return result
    }
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (isLoading || isRefetching) return <Typography variant="body1">Loading</Typography>
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableProductListContainer refetch={refetch} data={data} />
      </Grid>
    </Grid>
  )
}

export default Products
