// ** Next Imports
import { GetStaticProps } from 'next/types'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import AddCard from 'views/invoice/add/AddCard'
import AddActions from 'views/invoice/add/AddActions'

// ** Styled Component
import DatePickerWrapper from '@core/styles/libs/react-datepicker'
import { Box } from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { useRouter } from 'next/router'

export interface FormData {
  customerName: string
  customerEmail: string
  dateIssues: string
  paidAt: string
  customerNote?: string
  taxInclude: boolean
  paymentMethod: string
}

export const calculatorPrice = (items: Array<any>) => {
  return items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
}

const InvoiceAddPage = () => {
  // ** State

  const [invoiceItems, setInvoiceItems] = useState<Array<any>>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const router = useRouter()

  const schema = yup.object().shape({
    customerName: yup.string().required('Tên khách hàng không được bỏ trống'),
    customerEmail: yup.string().email('Email không hợp lệ').required('Email khách hàng không được bỏ trống'),
    dateIssues: yup.string().required('Ngày phát hành không được bỏ trống'),
    paidAt: yup.string().required('Ngày thanh toán không được bỏ trống'),
    customerNote: yup.string(),
    taxInclude: yup.boolean().required(),
    paymentMethod: yup.string().required()
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      customerNote: 'Thank for your bussiness 💘',
      taxInclude: true,
      paymentMethod: 'bank_transfer'
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true)
    if (invoiceItems.length === 0) {
      toast.error('Không thể tạo hóa đơn với không có sản phẩm', {
        id: 'missing-items'
      })
      return
    }

    const payload = {
      salePerson: 'Medical',
      customerNode: data.customerNote,
      status: 'payment_due',
      vatNumber: '',
      priceType: data?.taxInclude ? 'tax_inclusive' : 'tax_exclusive',
      dateIssues: dayjs(data.dateIssues).format('YYYY-MM-DD'),
      paidOn: dayjs().format('YYYY-MM-DD'),
      paidAt: dayjs(data.paidAt).format('YYYY-MM-DD'),
      amountPaid: 0, // Số tiền đã thanh toán
      amountDue: calculatorPrice(invoiceItems), // Số tiền còn lại phải thanh toán
      subTotal: calculatorPrice(invoiceItems),
      total: calculatorPrice(invoiceItems),
      tax: 0,
      shippingFee: 0,
      invoiceItems: invoiceItems.map(({ name, price, quantity, amount, discountPercentage, note }: any) => {
        return {
          name,
          price,
          quantity,
          amount,
          discountPercentage,
          note
        }
      }),
      paymentMethod: data?.paymentMethod,
      billingBank: {
        bankName: 'Vietcombank',
        country: 'Việt Nam',
        iban: '',
        swiftCode: '',
        accountNumber: '10153474380',
        accountName: 'Medical'
      },
      billingAddress: {
        name: 'Medical',
        email: 'medical@gmail.com',
        phone: '0123 456 789',
        country: 'Việt Nam',
        city: 'TP Hồ Chí Minh',
        state: 'TP Hồ Chí Minh',
        stateCode: 'HCM',
        zip: 70000,
        line1: 'Phường 1, Quận Tân Bình',
        line2: '236B Lê Văn Sỹ, Quận Tân Bình,'
      },
      shippingAddress: {
        name: data.customerName,
        email: data.customerEmail,
        phone: '0987654321',
        country: 'Việt Nam',
        city: 'TP Hồ Chí Minh',
        state: 'TP Hồ Chí Minh',
        stateCode: 'HCM',
        zip: 70000,
        line1: 'Phường 3, Quận 3',
        line2: '174 Nguyễn Thiện Thuật'
      },
      customerInformation: {
        name: data.customerName,
        email: data.customerEmail,
        avatar: null
      }
    }
    try {
      await axios.post(`${api.INVOICE}`, payload)
      router.replace('/invoice', undefined, { shallow: false })
      toast.success('Tạo hóa đơn thành công', {
        id: 'success-create-iinvoice'
      })
    } catch (error) {
      toast.error('Server đang bận, vui lòng thử lại sau', {
        id: 'error-create-invoice'
      })
    }

    setIsProcessing(false)
  }
  console.log('erorr', errors)

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <form onSubmit={handleSubmit(onSubmit)} id="form-add-invoice">
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <AddCard
              isProcessing={isProcessing}
              control={control}
              errors={errors}
              invoiceItems={invoiceItems}
              setInvoiceItems={setInvoiceItems}
            />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <Box sx={{ position: 'sticky', top: '5rem', height: '500px' }}>
              <AddActions control={control} isProcessing={isProcessing} />
            </Box>
          </Grid>
        </Grid>
      </form>
    </DatePickerWrapper>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  }
}

export default InvoiceAddPage
