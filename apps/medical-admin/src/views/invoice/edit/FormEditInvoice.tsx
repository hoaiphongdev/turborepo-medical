// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import AddCard from 'views/invoice/add/AddCard'
import AddActions from 'views/invoice/add/AddActions'

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
import { isEmpty } from 'lodash'

export interface FormData {
  dateIssues: any
  paidAt: any
  customerNote?: string
  taxInclude: boolean
  paymentMethod: string
}

export const calculatorPrice = (items: Array<any>) => {
  return items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
}

type FormEditInvoiceType = {
  invoiceData: any
}

const FormEditInvoice = ({ invoiceData }: FormEditInvoiceType) => {
  const router = useRouter()
  const [invoiceItems, setInvoiceItems] = useState<Array<any>>(
    invoiceData?.invoiceItems?.map((item: any) => {
      return {
        id: crypto.randomUUID(),
        productId: '',
        ...item
      }
    })
  )

  const [clientData, setClientData] = useState<any | null>({
    _id: '',
    name: invoiceData?.customerInformation?.name,
    email: invoiceData?.customerInformation?.email,
    avatar: invoiceData?.customerInformation?.avatar,
    phone: invoiceData?.shippingAddress?.phone,
    taxNumber: invoiceData?.vatNumber,
    vatNumber: invoiceData?.vatNumber,
    shippingAddress: invoiceData?.shippingAddress
  })
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const schema = yup.object().shape({
    dateIssues: yup.string().required('Ngày phát hành không được bỏ trống'),
    paidAt: yup.string().required('Ngày thanh toán không được bỏ trống'),
    customerNote: yup.string(),
    taxInclude: yup.boolean().required(),
    paymentMethod: yup.string().required()
  })

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      dateIssues: dayjs(invoiceData?.dateIssues)
        .toDate()
        .toString(),
      paidAt: dayjs(invoiceData?.paidAt)
        .toDate()
        .toString(),
      customerNote: isEmpty(invoiceData?.customerNote) ? 'Thank for your bussiness 💘' : invoiceData?.customerNote,
      taxInclude: invoiceData?.priceType === 'tax_inclusive',
      paymentMethod: invoiceData?.paymentMethod
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

    if (!clientData) {
      toast.error('Không thể tạo hóa đơn thiếu khách hàng', {
        id: 'missing-items'
      })
      return
    }

    const payload = {
      salePerson: 'Medical',
      customerNode: data.customerNote,
      status: 'payment_due',
      vatNumber: clientData?.taxNumber,
      priceType: data?.taxInclude ? 'tax_inclusive' : 'tax_exclusive',
      dateIssues: dayjs(data.dateIssues).format('YYYY-MM-DD'),
      paidOn: dayjs().format('YYYY-MM-DD'),
      paidAt: dayjs(data.paidAt).format('YYYY-MM-DD'),
      amountPaid: calculatorPrice(invoiceItems), // Số tiền đã thanh toán
      amountDue: 0, // Số tiền còn lại phải thanh toán
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
        name: clientData?.name,
        email: clientData?.email,
        phone: clientData?.phone,
        country: 'Việt Nam',
        city: clientData?.shippingAddress?.city,
        state: clientData?.shippingAddress?.state,
        stateCode: clientData?.shippingAddress?.stateCode,
        zip: clientData?.shippingAddress?.zip,
        line1: clientData?.shippingAddress?.line1,
        line2: clientData?.shippingAddress?.line2
      },
      customerInformation: {
        name: clientData?.name,
        email: clientData?.email,
        avatar: clientData?.avatar
      }
    }
    try {
      await axios.put(`${api.INVOICE}/${invoiceData._id}`, payload)
      router.replace('/invoice', undefined, { shallow: false })
      toast.success('Điều chỉnh hóa đơn thành công', {
        id: 'success-edit-invoice'
      })
    } catch (error) {
      toast.error('Server đang bận, vui lòng thử lại sau', {
        id: 'error-edit-invoice'
      })
    }

    setIsProcessing(false)
  }

  const handleSaveAndPrintInvoice = async () => {
    const data = getValues()

    setIsProcessing(true)
    if (invoiceItems.length === 0) {
      toast.error('Không thể tạo hóa đơn với không có sản phẩm', {
        id: 'missing-items'
      })
      return
    }

    if (!clientData) {
      toast.error('Không thể tạo hóa đơn thiếu khách hàng', {
        id: 'missing-items'
      })
      return
    }

    const payload = {
      salePerson: 'Medical',
      customerNode: data.customerNote,
      status: 'payment_due',
      vatNumber: clientData?.taxNumber,
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
        name: clientData?.name,
        email: clientData?.email,
        phone: clientData?.phone,
        country: 'Việt Nam',
        city: clientData?.shippingAddress?.city,
        state: clientData?.shippingAddress?.state,
        stateCode: clientData?.shippingAddress?.stateCode,
        zip: clientData?.shippingAddress?.zip,
        line1: clientData?.shippingAddress?.line1,
        line2: clientData?.shippingAddress?.line2
      },
      customerInformation: {
        name: clientData?.name,
        email: clientData?.email,
        avatar: clientData?.avatar
      }
    }
    try {
      const response = await axios.put(`${api.INVOICE}/${invoiceData._id}`, payload)
      router.replace(`/invoice/print/${response?.data?.data?._id}`, undefined, { shallow: false })
    } catch (error) {
      toast.error('Server đang bận, vui lòng thử lại sau', {
        id: 'error-edit--print-invoice'
      })
    }

    setIsProcessing(false)
  }
  const handleSaveAndPaidInvoice = async () => {
    const data = getValues()

    setIsProcessing(true)
    if (invoiceItems.length === 0) {
      toast.error('Không thể tạo hóa đơn với không có sản phẩm', {
        id: 'missing-items'
      })
      return
    }

    if (!clientData) {
      toast.error('Không thể tạo hóa đơn thiếu khách hàng', {
        id: 'missing-items'
      })
      return
    }

    const payload = {
      salePerson: 'Medical',
      customerNode: data.customerNote,
      status: 'paid',
      vatNumber: clientData?.taxNumber,
      priceType: data?.taxInclude ? 'tax_inclusive' : 'tax_exclusive',
      dateIssues: dayjs(data.dateIssues).format('YYYY-MM-DD'),
      paidOn: dayjs().format('YYYY-MM-DD'),
      paidAt: dayjs(data.paidAt).format('YYYY-MM-DD'),
      amountPaid: calculatorPrice(invoiceItems), // Số tiền đã thanh toán
      amountDue: 0, // Số tiền còn lại phải thanh toán
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
        name: clientData?.name,
        email: clientData?.email,
        phone: clientData?.phone,
        country: 'Việt Nam',
        city: clientData?.shippingAddress?.city,
        state: clientData?.shippingAddress?.state,
        stateCode: clientData?.shippingAddress?.stateCode,
        zip: clientData?.shippingAddress?.zip,
        line1: clientData?.shippingAddress?.line1,
        line2: clientData?.shippingAddress?.line2
      },
      customerInformation: {
        name: clientData?.name,
        email: clientData?.email,
        avatar: clientData?.avatar
      }
    }
    try {
      await axios.put(`${api.INVOICE}/${invoiceData._id}`, payload)
      router.replace('/invoice', undefined, { shallow: false })
      toast.success('Điều chỉnh hóa đơn thành công', {
        id: 'success-edit-invoice'
      })
    } catch (error) {
      toast.error('Server đang bận, vui lòng thử lại sau', {
        id: 'error-edit-invoice'
      })
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="form-action-invoice">
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <AddCard
            isProcessing={isProcessing}
            control={control}
            errors={errors}
            invoiceItems={invoiceItems}
            clientData={clientData}
            setClientData={setClientData}
            setInvoiceItems={setInvoiceItems}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <Box sx={{ position: 'sticky', top: '5rem', height: '500px' }}>
            <AddActions
              control={control}
              isProcessing={isProcessing}
              handleSaveAndPrintInvoice={handleSaveAndPrintInvoice}
              handleSaveAndPaidInvoice={handleSaveAndPaidInvoice}
            />
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default FormEditInvoice
