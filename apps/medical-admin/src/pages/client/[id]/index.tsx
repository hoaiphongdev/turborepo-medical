// ** React Imports
import { useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
// ** Third Party Imports
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import FormEditClient from 'views/client/edit/FormEditClient'

const CreateClientPage = () => {
  const router = useRouter()
  const { query } = router

  const { isLoading, isRefetching, data, refetch } = useQuery({
    queryKey: ['get-client-detail', query['id']],
    queryFn: async () => {
      const response = await axios.get(`${api.CLIENT}/${query['id']}`)
      return response?.data?.data
    },
    retry: false,
    staleTime: Infinity
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Điều chỉnh khách hàng (nhà thuốc/bệnh viện) 🪛🏥" />
          {isLoading || isRefetching ? (
            <Typography variant="body2" sx={{ m: 4 }}>
              Loading
            </Typography>
          ) : (
            <FormEditClient client={data} clientAvatar={data.avatar ?? ''} />
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default CreateClientPage
