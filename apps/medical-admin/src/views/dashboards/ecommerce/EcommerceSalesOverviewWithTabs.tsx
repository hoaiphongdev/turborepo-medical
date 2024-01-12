import { SyntheticEvent, useState } from 'react'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import Table from '@mui/material/Table'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import TabContext from '@mui/lab/TabContext'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

import { ThemeColor } from 'config-mui'
import CustomChip from '@core/components/mui/chip'

interface StatusObj {
  [ke: string]: {
    text: string
    color: ThemeColor
  }
}

interface TabAvatarType {
  imgWidth: number
  category: string
  imgHeight: number
}

interface TabContentType {
  imgAlt: string
  imgSrc: string
  product: string
  revenue: string
  conversion: string
  conversionDifference?: 'positive' | 'negative'
  status: 'in-stock' | 'coming-soon' | 'out-of-stock'
}

interface TabContentDataType {
  pill: TabContentType[]
  tools: TabContentType[]
  beauty: TabContentType[]
}

const statusObj: StatusObj = {
  'in-stock': { text: 'In Stock', color: 'success' },
  'coming-soon': { text: 'Coming Soon', color: 'warning' },
  'out-of-stock': { text: 'Out of Stock', color: 'primary' }
}

const tabAvatars: TabAvatarType[] = [
  {
    imgWidth: 30,
    imgHeight: 58,
    category: 'pill'
  },
  {
    imgWidth: 52,
    imgHeight: 42,
    category: 'tools'
  },
  {
    imgWidth: 60,
    imgHeight: 42,
    category: 'beauty'
  }
]

const tabContentData: TabContentDataType = {
  pill: [
    {
      revenue: '892.421.000đ',
      conversion: '+24',
      imgAlt: 'samsung-s22',
      status: 'out-of-stock',
      product: 'Viên sủi Effer',
      imgSrc: '/images/pills/1.jpg'
    },
    {
      revenue: '432.121.000đ',
      conversion: '-18',
      status: 'in-stock',
      imgAlt: 'apple-iPhone-13-pro',
      product: 'Panadol',
      conversionDifference: 'negative',
      imgSrc: '/images/pills/2.jpg'
    },
    {
      revenue: '552.121.000đ',
      conversion: '+55',
      status: 'in-stock',
      imgAlt: 'oneplus-9-pro',
      product: 'Leana Octavill',
      imgSrc: '/images/pills/3.jpg'
    }
  ],
  tools: [
    {
      revenue: '521.123.531đ',
      conversion: '+2',
      imgAlt: 'samsung-s22',
      status: 'in-stock',
      product: 'Nẹp',
      imgSrc: '/images/pills/4.jpg'
    },
    {
      revenue: '444.121.112đ',
      conversion: '-18',
      status: 'in-stock',
      imgAlt: 'apple-iPhone-13-pro',
      product: 'Máy đo huyết áp',
      conversionDifference: 'negative',
      imgSrc: '/images/pills/5.jpg'
    },
    {
      revenue: '178.213.000đ',
      conversion: '-9',
      status: 'in-stock',
      imgAlt: 'oneplus-9-pro',
      product: 'Bình dưỡng khí',
      conversionDifference: 'negative',
      imgSrc: '/images/pills/6.jpg'
    }
  ],
  beauty: [
    {
      revenue: '1.234.556.212đ',
      conversion: '+67',
      status: 'out-of-stock',
      imgAlt: 'sony-play-station-5',
      product: 'Whey Protein',
      imgSrc: '/images/pills/7.jpg'
    },
    {
      revenue: '342.235.780đ',
      conversion: '-21',
      status: 'out-of-stock',
      imgAlt: 'xbox-series-x',
      product: 'Mặt nạ',
      conversionDifference: 'negative',
      imgSrc: '/images/pills/8.jpg'
    },
    {
      revenue: '141.789.553đ',
      conversion: '+38',
      status: 'in-stock',
      imgAlt: 'nintendo-switch',
      product: 'Sữa dưỡng ẩm',
      imgSrc: '/images/pills/9.jpg'
    }
  ]
}

const RenderTabContent = ({ data }: { data: TabContentType[] }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ '& .MuiTableCell-root': { py: (theme) => `${theme.spacing(2.5)} !important` } }}>
            <TableCell>Hình ảnh</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>Sản phẩm</TableCell>
            <TableCell align='right'>Trạng thái</TableCell>
            <TableCell align='right'>Nguồn thu</TableCell>
            <TableCell align='right'>Conversion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: TabContentType, index: number) => (
            <TableRow
              key={index}
              sx={{
                '& .MuiTableCell-root': {
                  border: 0,
                  py: (theme) => `${theme.spacing(1.5)} !important`
                },
                '&:first-of-type .MuiTableCell-body': {
                  pt: (theme) => `${theme.spacing(3)} !important`
                },
                '&:last-child .MuiTableCell-body': {
                  pb: (theme) => `${theme.spacing(3)} !important`
                }
              }}
            >
              <TableCell>
                <Avatar
                  alt={row.imgAlt}
                  src={row.imgSrc}
                  variant='rounded'
                  sx={{ width: 34, height: 34 }} />
              </TableCell>
              <TableCell>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: 'text.primary'
                  }}
                >
                  {row.product}
                </Typography>
              </TableCell>
              <TableCell align='right'>
                <CustomChip
                  skin='light'
                  size='small'
                  label={statusObj[row.status].text}
                  color={statusObj[row.status].color}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1.625, lineHeight: 1.539 }
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 600,
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    color: 'text.primary'
                  }}
                >
                  {row.revenue}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 600,
                    textAlign: 'right',
                    color: row.conversionDifference === 'negative' ? 'error.main' : 'success.main'
                  }}
                >{`${row.conversion}%`}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const EcommerceSalesOverviewWithTabs = () => {
  // ** State
  const [value, setValue] = useState<string>('pill')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const RenderTabAvatar = ({ data }: { data: TabAvatarType }) => (
    <Avatar
      variant='rounded'
      alt={`tabs-${data.category}`}
      src={`/images/categories/${data.category}.png`}
      sx={{
        width: 100,
        height: 92,
        backgroundColor: 'transparent',
        '& img': { width: '40px', height: '40px' },
        border: (theme) =>
          value === data.category ? `2px solid ${theme.palette.primary.main}` : `2px dashed ${theme.palette.divider}`
      }}
    />
  )

  return (
    <Card>
      <CardHeader
        title='Sản phẩm được tương tác cao'
        subheader='82% tổng giá trị doanh thu'
      />
      <TabContext value={value}>
        <TabList
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleChange}
          aria-label='top referral sources tabs'
          sx={{
            mb: 2.5,
            px: 5,
            '& .MuiTab-root:not(:last-child)': { mr: 4 },
            '& .MuiTabs-indicator': { display: 'none' }
          }}
        >
          <Tab
            value='pill'
            sx={{ p: 0 }}
            label={<RenderTabAvatar data={tabAvatars[0]} />} />
          <Tab
            value='tools'
            sx={{ p: 0 }}
            label={<RenderTabAvatar data={tabAvatars[1]} />} />
          <Tab
            value='beauty'
            sx={{ p: 0 }}
            label={<RenderTabAvatar data={tabAvatars[2]} />} />
        </TabList>

        <TabPanel
          sx={{ p: 0 }}
          value='pill'>
          <RenderTabContent data={tabContentData['pill']} />
        </TabPanel>
        <TabPanel
          sx={{ p: 0 }}
          value='tools'>
          <RenderTabContent data={tabContentData['tools']} />
        </TabPanel>
        <TabPanel
          sx={{ p: 0 }}
          value='beauty'>
          <RenderTabContent data={tabContentData['beauty']} />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default EcommerceSalesOverviewWithTabs
