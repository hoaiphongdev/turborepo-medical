import React, { FC, useState } from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { api } from 'configs/api.endpoint'
import { hexToRGBA } from 'core'
import { useTheme } from '@mui/system'
import { isEmpty } from 'lodash'

interface ISelectClientProps {
  clientId?: string
  handleSelectClient: (clientSelected: any) => void
}

const SelectClient: FC<ISelectClientProps> = (props) => {
  const { clientId, handleSelectClient } = props

  const theme = useTheme()
  const [dataClients, setDataClients] = useState<Array<any>>([])

  const [nameClient, setNameClient] = useState('')
  const { isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['get-select-client', nameClient],
    queryFn: async () => {
      const response = await axios.get(`${api.CLIENT}`, {
        params: {
          keyword: nameClient
        }
      })

      const products = response?.data?.data?.records ?? []
      setDataClients(products)

      return products.map((item: any) => {
        return {
          label: `${item.name}`,
          value: item._id
        }
      })
    },
    retry: false,
    staleTime: Infinity
  })

  const handleChangeInput = (e: any) => setNameClient(e ?? '')

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
      placeholder={isLoading || isRefetching ? 'Đang tải các nhà thuốc...' : 'Chọn nhà thuốc/bệnh viện'}
      options={(dataClients ?? []).map((item: any) => {
        return {
          label: `${item.name}`,
          value: item._id
        }
      })}
      isLoading={isLoading || isRefetching}
      onFocus={() => refetch()}
      onInputChange={handleChangeInput}
      defaultValue={
        isEmpty(clientId)
          ? null
          : {
              label: dataClients.find((x: any) => x._id === clientId)?.name ?? '',
              value: clientId
            }
      }
      onChange={(item: any) => {
        const clientSelected = dataClients.find((x: any) => x._id === item.value)
        handleSelectClient(clientSelected)
      }}
    />
  )
}

export default SelectClient
