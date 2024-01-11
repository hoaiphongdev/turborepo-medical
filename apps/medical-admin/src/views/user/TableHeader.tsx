// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Link from 'next/link'

interface TableHeaderProps {
  value: string
  handleCreateProduct?: () => void
  handleFilter?: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleCreateProduct } = props

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* <Button
        sx={{ mr: 4, mb: 2 }}
        color="secondary"
        variant="outlined"
        startIcon={<Icon icon="mdi:export-variant" fontSize={20} />}
      >
        Export
      </Button> */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* <TextField
          size="small"
          value={value}
          sx={{ mr: 6, mb: 2 }}
          placeholder="Tìm kiếm theo tên"
          onChange={(e) => handleFilter(e.target.value)}
        /> */}
        <Button
          LinkComponent={Link}
          href={`/products/new-product`}
          sx={{ mb: 2 }}
          onClick={handleCreateProduct}
          variant="contained"
        >
          Tạo sản phẩm mới
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
