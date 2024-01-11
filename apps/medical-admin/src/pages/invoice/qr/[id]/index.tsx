// ** React Imports
import { ReactNode, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import BlankLayout from '@core/layouts/BlankLayout'
import QRCode from 'qrcode'
import { Card, Container } from '@mui/material'

const QRCodePage = () => {
  const [qrcode, setQrcode] = useState()
  const { query } = useRouter()

  useEffect(() => {
    const invoiceId = query['id']
    const host = typeof window === 'undefined' ? 'localhost:3100' : window.location.host
    const link = host.includes('localhost')
      ? `http://${host}/payment/${invoiceId}`
      : `https://${host}/payment/${invoiceId}`
    QRCode.toDataURL(link).then((val: any) => setQrcode(val))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query['id']])

  return (
    <Container sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Quét mã bên dưới để đi đến trang thanh toán
          </Typography>
          <img src={qrcode} alt='QR_CODE'></img>
        </CardContent>
      </Card>
    </Container>
  )
}

QRCodePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

QRCodePage.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default QRCodePage
