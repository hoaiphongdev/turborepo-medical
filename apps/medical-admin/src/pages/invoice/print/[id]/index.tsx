// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Demo Components Imports
import PrintPage from 'views/invoice/print/PrintPage'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { api } from 'configs/api.endpoint'
import { Typography } from '@mui/material'
import BlankLayout from '@core/layouts/BlankLayout'

const InvoicePrint = () => {
  const { query } = useRouter()

  const { isLoading, isRefetching, data, refetch } = useQuery({
    queryKey: ['get-print-invoice', query['id']],
    queryFn: async () => {
      const response = await axios.get(`${api.INVOICE}/${query['id']}`)
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

  return <PrintPage invoiceData={data} />
}

InvoicePrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

InvoicePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default InvoicePrint
