// ** Next Import
import Link from 'next/link'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          value={value}
          placeholder="Tìm kiếm hóa đơn"
          sx={{ mr: 4, mb: 2, width: '580px' }}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2 }} component={Link} variant="contained" href="/invoice/create-invoice">
          Tạo hóa đơn mới
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
