// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from '@core/components/icon'

// ** Store & Actions Imports

// ** Types Imports
// import { RootState, AppDispatch } from 'store'
import { ThemeColor } from '@core/layouts/types'

// ** Utils Import
import { formatCurrencyVND } from 'core'

// ** Custom Components Imports
import CustomChip from '@core/components/mui/chip'
import CustomAvatar from '@core/components/mui/avatar'
import TableHeader from 'views/invoice/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from '@core/styles/libs/react-datepicker'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { PaginatedType } from 'types/common/paginated'
import dayjs from 'dayjs'
import { IconButton } from '@mui/material'
import { isEmpty } from 'lodash'

export const getInitials = (string: string) =>
  string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CellType {
  row: any
}

const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if (!isEmpty(row?.customerInformation?.avatar)) {
    return (
      <CustomAvatar src={`${row?.customerInformation?.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
    )
  } else {
    return (
      <CustomAvatar
        skin="light"
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row?.customerInformation?.name ? row?.customerInformation?.name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  posted: { color: 'secondary', icon: 'mdi:send' },
  paid: { color: 'success', icon: 'mdi:check' },
  payment_due: { color: 'primary', icon: 'mdi:content-save-outline' },
  voided: { color: 'warning', icon: 'mdi:close-circle-outline' },
  not_paid: { color: 'error', icon: 'mdi:information-outline' },
  pending: { color: 'info', icon: 'mdi:clock-time-two-outline' }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: '#',
    renderCell: ({ row }: CellType) => <LinkStyled href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</LinkStyled>
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'invoiceStatus',
    headerName: 'Trạng thái',
    renderCell: ({ row }: CellType) => {
      const { dueDate, balance, invoiceStatus } = row

      const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary'

      return (
        <Tooltip
          title={
            <div>
              <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 600 }}>
                {invoiceStatus}
              </Typography>
              <br />
              <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 600 }}>
                Balance:
              </Typography>{' '}
              {balance}
              <br />
              <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 600 }}>
                Due Date:
              </Typography>{' '}
              {dueDate}
            </div>
          }
        >
          <CustomAvatar skin="light" color={color} sx={{ width: 34, height: 34 }}>
            <Icon icon={invoiceStatusObj[invoiceStatus].icon} fontSize="1.25rem" />
          </CustomAvatar>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.25,
    field: 'name',
    minWidth: 300,
    headerName: 'Khách hàng',
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params
      const { name, companyEmail } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(params)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
            >
              {name}
            </Typography>
            <Typography noWrap variant="caption">
              {companyEmail}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'total',
    headerName: 'Tổng',
    renderCell: ({ row }: CellType) => <Typography variant="body2">{`${formatCurrencyVND(row.total)}`}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'issuedDate',
    headerName: 'Ngày phát hành',
    renderCell: ({ row }: CellType) => <Typography variant="body2">{row.issuedDate}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'balance',
    headerName: 'Cần thanh toán',
    renderCell: ({ row }: CellType) => {
      return row.balance !== 0 ? (
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {formatCurrencyVND(row.balance as number)}
        </Typography>
      ) : (
        <CustomChip size="small" skin="light" color="success" label="Paid" />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 130,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="In/tải hóa đơn">
          <IconButton size="small" component={Link} sx={{ mr: 0.5 }} href={`/invoice/print/${row._id}`}>
            <Icon icon="mdi:printer" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <IconButton size="small" component={Link} sx={{ mr: 0.5 }} href={`/invoice/edit-invoice/${row._id}`}>
            <Icon icon="mdi:pencil-outline" />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }
]

/* eslint-enable */

const InvoiceListPage = () => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { isLoading, isRefetching, data, refetch } = useQuery({
    queryKey: ['get-invoices'],
    queryFn: async () => {
      // const { page = 1, pageSize: limit = 10 } = paginationModel
      // let repage = page === 0 ? page + 1 : page
      const response = await axios.get(`${api.INVOICE}`)

      return {
        ...response.data.data,
        records: (response?.data?.data?.records ?? [])
          .map((item: any) => {
            return {
              ...item,
              id: item.poNumber,
              invoiceStatus: item.status,
              name: item?.customerInformation?.name ?? '<Emtpty>',
              companyEmail: item?.customerInformation?.email ?? '<Emtpty>',
              total: item.total,
              issuedDate: dayjs(item.dateIssues).format('DD/MM/YYYY'),
              balance: item.amountDue ?? 0,
              dueDate: dayjs(item.paidAt).format('DD/MM/YYYY')
            }
          })
          .sort((a: any, b: any) => {
            return b?.poNumber - a?.poNumber
          })
      } as PaginatedType
    },
    retry: false,
    staleTime: Infinity
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                rows={data?.records ?? []}
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

export default InvoiceListPage
