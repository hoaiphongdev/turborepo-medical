import { Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ListCardCategories, { CartStats } from 'views/categories/ListCardCategories'

const CategoriesPage = () => {
  const router = useRouter()
  const { isLoading, isRefetching, data, refetch } = useQuery({
    queryKey: ['get-categories'],
    queryFn: async () => {
      const response = await axios.get(`${api.CATEGORY}`)
      const result = (response?.data?.data?.records ?? []).map((item: any) => {
        return {
          id: item._id,
          src: isEmpty(item.image) ? '/images/cards/amazon-echo-dot.png' : item.image,
          title: item?.name,
          stats: 'Trạng thái',
          chipText: dayjs(item?.updatedAt).format('DD-MM-YYYY'),
          trendNumber: item.isActive ? 'active' : 'inactive',
          chipColor: 'success',
          trend: item.isActive ? 'positive' : 'negative'
        } as CartStats
      })

      return result as Array<CartStats>
    }
  })

  useEffect(() => {
    if (!isRefetching) refetch()
  }, [])

  if (isLoading || isRefetching) return <Typography variant="body1">Loading</Typography>

  return <ListCardCategories categories={data ?? []} />
}

export default CategoriesPage
