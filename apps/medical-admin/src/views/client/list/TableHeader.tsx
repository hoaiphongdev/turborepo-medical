import Link from 'next/link'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const TableHeader = () => {
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
        <Button sx={{ mb: 2 }} component={Link} variant="contained" href="/client/create">
          Tạo khách hàng (nhà thuốc/bệnh viện) mới
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
