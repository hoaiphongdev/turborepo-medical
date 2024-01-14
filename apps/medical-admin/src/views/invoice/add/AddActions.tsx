// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from '@core/components/icon'
import { Controller } from 'react-hook-form'
import { useState } from 'react'

const OptionsWrapper = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

type AddActionProps = {
  control: any
  isProcessing: boolean
  handleSaveAndPrintInvoice: () => void
  handleSaveAndPaidInvoice: () => void
}

const AddActions = (props: AddActionProps) => {
  const { control, isProcessing = false, handleSaveAndPrintInvoice, handleSaveAndPaidInvoice } = props

  const [isAcceptTerm, setIsAcceptTerm] = useState<boolean>(true)

  return (
    <Card>
      <CardContent>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="payment-select">Thanh toán qua</InputLabel>
            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  fullWidth
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  label="Accept payments via"
                  labelId="payment-select"
                  sx={{ mb: 4 }}
                >
                  <MenuItem value="bank_transfer">Ngân hàng</MenuItem>
                  <MenuItem value="cash">Tiền mặt</MenuItem>
                  <MenuItem value="credit_card">Online</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          <OptionsWrapper sx={{ mb: 1 }}>
            <InputLabel
              htmlFor="invoice-add-payment-terms"
              sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
            >
              Hóa đơn bao gồm thuế
            </InputLabel>
            <Controller
              name="taxInclude"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Switch
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  defaultChecked
                  id="invoice-add-payment-terms"
                />
              )}
            />
          </OptionsWrapper>
        </Grid>
        <OptionsWrapper sx={{ mb: 1 }}>
          <InputLabel
            htmlFor="invoice-add-payment-terms"
            sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
          >
            Điều khoản thanh toán
          </InputLabel>
          <Switch
            checked={isAcceptTerm}
            onChange={(e) => setIsAcceptTerm(e.target.checked)}
            id="invoice-add-payment-terms"
          />
        </OptionsWrapper>
        <Button
          disabled={!isAcceptTerm || isProcessing}
          form="form-action-invoice"
          type="submit"
          fullWidth
          sx={{ mt: 3.5 }}
          variant="outlined"
        >
          Lưu hóa đơn
        </Button>
        <Button
          disabled={!isAcceptTerm || isProcessing}
          fullWidth
          sx={{ mt: 3.5 }}
          variant="outlined"
          onClick={handleSaveAndPrintInvoice}
          startIcon={<Icon icon="mdi:printer" />}
        >
          Lưu & In hóa đơn
        </Button>
        <Button
          disabled={!isAcceptTerm || isProcessing}
          fullWidth
          sx={{ mt: 3.5 }}
          variant="contained"
          onClick={handleSaveAndPaidInvoice}
          startIcon={<Icon icon="mdi:send-outline" />}
        >
          Đã thanh toán hóa đơn
        </Button>
      </CardContent>
    </Card>
  )
}

export default AddActions
