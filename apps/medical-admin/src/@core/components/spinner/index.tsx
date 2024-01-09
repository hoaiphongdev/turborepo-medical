// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import MedicalIcon from '../medical-icon'
import { Typography } from '@mui/material'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <MedicalIcon className="spinner" width={80} height={80} />
      <Typography variant="h5" sx={{ mt: 8 }}>
        Loading
      </Typography>
    </Box>
  )
}

export default FallbackSpinner
