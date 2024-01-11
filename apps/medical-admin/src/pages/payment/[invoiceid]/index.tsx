// ** Demo Components Imports
import BlankLayout from '@core/layouts/BlankLayout'
import { Container, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import PaymentWizzard from 'views/payment'

const PaymentPage = () => {
  const { query } = useRouter()

  const { isLoading, isRefetching, data, refetch } = useQuery({
    queryKey: ['get-payment-invoice', query['invoiceid']],
    queryFn: async () => {
      const response = await axios.get(`${api.INVOICE}/${query['invoiceid']}`)
      return response.data.data
    },
    retry: false,
    staleTime: Infinity
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading || isRefetching) return <Typography>Loading...</Typography>

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <PaymentWizzard invoiceData={data} />
    </Container>
  )
}

PaymentPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
PaymentPage.setConfig = () => {
  return {
    mode: 'light'
  }
}

PaymentPage.guestGuard = true
PaymentPage.authGuard = false

export default PaymentPage
