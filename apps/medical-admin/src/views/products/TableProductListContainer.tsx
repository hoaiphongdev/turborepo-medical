// ** React Imports
import { useState, MouseEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from '@core/components/icon'

// ** Store Imports

// ** Custom Components Imports
import CustomChip from '@core/components/mui/chip'
import CustomAvatar from '@core/components/mui/avatar'

// // ** Custom Table Components Imports
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'
import { Button, Tooltip } from '@mui/material'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { formatCurrencyVND } from 'core'

export const getInitials = (string: string) =>
  string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')

interface CellType {
  row: any
}

const statusProductObj: any = {
  publish: 'primary',
  draft: 'secondary'
}

// ** renders client column
const renderClient = (row: any) => {
  if (!isEmpty(row?.images)) {
    return <CustomAvatar variant="rounded" src={row?.images} sx={{ mr: 3, width: 40, height: 40, fontSize: '1rem' }} />
  } else {
    return (
      <CustomAvatar
        variant="rounded"
        skin="light"
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 40, height: 40, fontSize: '1rem' }}
      ></CustomAvatar>
    )
  }
}

type Props = {
  data: any
  refetch: any
}
const TableProductListContainer = (props: Props) => {
  const { data, refetch } = props
  const router = useRouter()
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const RowOptions = ({ id }: { id: number | string }) => {
    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleEdit = async () => {
      router.push(`products/edit/${id}`)
      handleRowOptionsClose()
    }
    const handleDelete = async () => {
      handleRowOptionsClose()
      const response = await axios.delete(`${api.PRODUCT}/${id}`)
      if (response?.data?.isSuccess) {
        toast.success('Xoá sản phẩm thành công', { id: 'success-process-delete-product' })
        refetch()
      }
    }

    return (
      <>
        <IconButton size="small" onClick={handleRowOptionsClick}>
          <Icon icon="mdi:dots-vertical" />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          <MenuItem onClick={handleEdit} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon="mdi:pencil-outline" fontSize={20} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon="mdi:delete-outline" fontSize={20} />
            Delete
          </MenuItem>
        </Menu>
      </>
    )
  }

  const columns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 230,
      field: 'name',
      headerName: 'Sản phẩm',
      renderCell: ({ row }: CellType) => {
        const { name } = row
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Tooltip title={name}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography noWrap variant="subtitle2">
                  {name}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'category',
      headerName: 'Danh mục',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant="subtitle2">
            {row?.category?.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Giá gốc',
      field: 'basePrice',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {formatCurrencyVND(row.basePrice)}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Giá bán thực tế',
      field: 'salePrice',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {formatCurrencyVND(row.salePrice)}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 120,
      headerName: 'trạng thái',
      field: 'status',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            skin="light"
            size="small"
            label={row.status}
            color={statusProductObj[row.status]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Ngày tạo',
      field: 'createdAt',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant="subtitle1" noWrap sx={{ textTransform: 'capitalize' }}>
            {dayjs(row.createdAt).format('DD/MM/YYYY')}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} />
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Danh sách sản phẩm 💊"
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          />
          <Box
            sx={{
              p: 5,
              pb: 3,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button LinkComponent={Link} href={`/products/new-product`} sx={{ mb: 2 }} variant="contained">
                Tạo sản phẩm mới
              </Button>
            </Box>
          </Box>
          <DataGrid
            autoHeight
            rows={data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default TableProductListContainer
