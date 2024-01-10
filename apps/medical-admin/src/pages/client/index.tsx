// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from '@core/components/icon'

// ** Store & Actions Imports

// ** Types Imports
// import { RootState, AppDispatch } from 'store'
import { ThemeColor } from '@core/layouts/types'
import { InvoiceType } from 'types/apps/invoiceTypes'

// ** Custom Components Imports
import CustomAvatar from '@core/components/mui/avatar'

// ** Styled Components
import DatePickerWrapper from '@core/styles/libs/react-datepicker'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { IconButton } from '@mui/material'
import TableHeader from 'views/client/list/TableHeader'

export const getInitials = (string: string) =>
  string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')

interface CellType {
  row: InvoiceType
}

const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if (row.avatar.length) {
    return <CustomAvatar src={`${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin="light"
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.name ? row.name : 'John Doe')}
      </CustomAvatar>
    )
  }
}


const defaultColumns: GridColDef[] = [
  {
    flex: 0.175,
    minWidth: 150,
    field: 'name',
    headerName: 'Nhà thuốc/bệnh viện',
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(params)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.name}
            </Typography>
            <Typography noWrap variant="caption">
              {row.email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.125,
    minWidth: 80,
    headerName: 'Số điện thoại',
    field: 'phone',
    valueGetter: (params) => new Date(params.value),
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        {params.row.phone}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    field: 'taxNumber',
    headerName: 'Mã số thuế',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        {params.row.taxNumber}
      </Typography>
    )
  },
  {
    flex: 0.25,
    field: 'shippingAddress',
    minWidth: 290,
    headerName: 'Địa chỉ',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        {params.row.shippingAddress?.line1 ?? ''}, {params.row.shippingAddress?.line2 ?? ''},{' '}
        {params.row.shippingAddress?.city ?? ''}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 130,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="View">
          <IconButton size="small" component={Link} sx={{ mr: 0.5 }} href={`/client/${row.id}`}>
            <Icon icon="mdi:pencil-outline" />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }
]

/* eslint-enable */

const ClientListPage = () => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  // const [keyword, setKeyword] = useState<string>('')
  // const keywordDebounce = useDebounce(keyword, 600)

  const { isLoading, isRefetching, data, refetch } = useQuery({
    queryKey: ['get-clients'],
    queryFn: async () => {
      const response = await axios.get(`${api.CLIENT}`)
      const records = response?.data?.data?.records ?? []

      return records.map((item: any) => {
        return {
          id: item._id,
          ...item
        }
      })
    },
    retry: false,
    staleTime: Infinity
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const handleFilter = (val: string = '') => {
  //   setKeyword(val)
  // }

  const columns: GridColDef[] = [...defaultColumns]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableHeader />
            {isLoading || isRefetching ? (
              <Typography variant="body2" sx={{ margin: 7 }}>
                Loading
              </Typography>
            ) : (
              <DataGrid
                autoHeight
                pagination
                // @ts-ignore
                rows={data ?? []}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default ClientListPage
