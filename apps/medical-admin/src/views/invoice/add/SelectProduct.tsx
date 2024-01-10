import React, { FC, useState } from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { hexToRGBA } from 'core'
import { useTheme } from '@mui/system'
import { isEmpty } from 'lodash'

interface ISelectProductProps {
  productId?: string
  invoiceUIId: string
  handleSelectProduct: (invoiceUIId: string, productSelected: any) => void
  exceptIds: Array<string>
}

const SelectProduct: FC<ISelectProductProps> = (props) => {
  const { productId, invoiceUIId, handleSelectProduct, exceptIds = [] } = props

  const theme = useTheme()
  const [dataProducts, setDataProducts] = useState<Array<any>>([])

  const [nameProduct, setNameProduct] = useState('')
  const { isLoading, data } = useQuery({
    queryKey: ['get-select-product', nameProduct, invoiceUIId],
    queryFn: async () => {
      const response = await axios.get(`${api.PRODUCT}`, {
        params: {
          keyword: nameProduct
        }
      })
      console.log('response', response)

      const products = response?.data?.data?.records ?? []
      setDataProducts(products)

      return products
        .filter((p: any) => !exceptIds.includes(p._id))
        .map((item: any) => {
          return {
            label: `${item.name}`,
            value: item._id
          }
        })
    },
    retry: false,
    staleTime: Infinity
  })

  const handleChangeInput = (e: any) => setNameProduct(e ?? '')

  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          border: `1px solid ${theme.palette.secondary}`,
          boxShadow: '1px solid #E9EAEC',
          '&:hover': {
            border: `1px solid ${hexToRGBA(theme.palette.primary.main, 0.8)}`,
            color: theme.palette.primary.main
          }
        }),
        option: (styles, { isSelected }) => {
          return {
            ...styles,
            backgroundColor: isSelected ? theme.palette.primary.main : 'white',
            '&:hover': {
              background: `${hexToRGBA(theme.palette.primary.main, 0.2)}`,
              color: theme.palette.primary.main
            },
            color: isSelected ? 'white' : 'black'
          }
        }
      }}
      placeholder={isLoading ? 'Loading...' : ''}
      options={(data ?? []).filter((p: any) => !exceptIds.includes(p._id))}
      isLoading={isLoading}
      onInputChange={handleChangeInput}
      defaultValue={
        isEmpty(productId)
          ? null
          : {
              label: dataProducts.find((x: any) => x._id === productId)?.name ?? '',
              value: productId
            }
      }
      onChange={(item: any) => {
        const productSelected = dataProducts.find((x: any) => x._id === item.value)

        console.log('dataProducts', dataProducts)
        console.log('productSelected', productSelected)

        handleSelectProduct(invoiceUIId, productSelected)
      }}
    />
  )
}

export default SelectProduct
