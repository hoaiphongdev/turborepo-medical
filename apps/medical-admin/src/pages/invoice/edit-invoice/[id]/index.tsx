// ** Styled Component
import DatePickerWrapper from '@core/styles/libs/react-datepicker'

import { useRouter } from 'next/router'
import FormEditInvoice from 'views/invoice/edit/FormEditInvoice'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Typography } from '@mui/material'

const InvoiceAddPage = () => {
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

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <FormEditInvoice invoiceData={data} />
    </DatePickerWrapper>
  )
}

export default InvoiceAddPage
