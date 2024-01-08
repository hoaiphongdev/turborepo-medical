// ** React Imports
import { ChangeEvent, MouseEvent, useState } from 'react'
// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { visuallyHidden } from '@mui/utils'
import { alpha } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import TableSortLabel from '@mui/material/TableSortLabel'
import TablePagination from '@mui/material/TablePagination'
import { Icon } from '@iconify/react'
import { Button, Card, CardContent, CardHeader, FormControl, FormHelperText, Grid, TextField } from '@mui/material'

// ** Icon Imports

type Order = 'asc' | 'desc'

interface Data {
  id: number | string
  name: string
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Data) => void
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

const createData = (id: number, name: string): Data => {
  return { id, name }
}

const rows = [
  createData(1, 'Donut'),
  createData(2, 'Eclair'),
  createData(3, 'Frozen yoghurt'),
  createData(4, 'Gingerbread'),
  createData(5, 'Honeycomb'),
  createData(6, 'Ice cream sandwich'),
  createData(7, 'Jelly Bean'),
  createData(8, 'KitKat'),
  createData(9, 'Lollipop'),
  createData(10, 'Marshmallow'),
  createData(11, 'Nougat'),
  createData(12, 'Oreo')
]

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }

  return 0
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order

    return a[1] - b[1]
  })

  return stabilizedThis.map((el) => el[0])
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'ID'
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Category Name'
  }
]

function EnhancedTableHead(props: EnhancedTableProps) {
  // ** Props
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof Data) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            onChange={onSelectAllClick}
            checked={rowCount > 0 && numSelected === rowCount}
            inputProps={{ 'aria-label': 'select all desserts' }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              onClick={createSortHandler(headCell.id)}
              direction={orderBy === headCell.id ? order : 'asc'}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  // ** Prop
  const { numSelected } = props

  return (
    <Toolbar
      sx={{
        px: (theme) => `${theme.spacing(5)} !important`,
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          List Category
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton sx={{ color: 'text.secondary' }}>
            <Icon icon="mdi:delete-outline" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  )
}

const AddNewCategoryForm = () => {
  const schema = yup.object().shape({
    name: yup.string().required()
  })

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    // defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: any) => {
    console.log('data', data)
  }
  return (
    <>
      <Card
        sx={{
          marginBottom: 6
        }}
        variant="outlined"
      >
        <CardHeader title="Create new category" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label="Name Category"
                        onChange={onChange}
                        placeholder="Ex: Donut, Drug, etc.."
                        error={Boolean(errors.name)}
                        aria-describedby="validation-schema-name"
                      />
                    )}
                  />
                  {errors.name && (
                    <FormHelperText sx={{ color: 'error.main' }} id="validation-schema-name">
                      {errors.name.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button size="large" type="submit" variant="contained">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

const EnhancedTable = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [order, setOrder] = useState<Order>('asc')
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [orderBy, setOrderBy] = useState<keyof Data>('name')
  const [selected, setSelected] = useState<readonly string[]>([])

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []
    console.log('selectedIndex', selectedIndex)
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <>
      <AddNewCategoryForm />
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            rowCount={rows.length}
            numSelected={selected.length}
            onRequestSort={handleRequestSort}
            onSelectAllClick={handleSelectAllClick}
          />
          <TableBody>
            {/* if you don't need to support IE11, you can replace the `stableSort` call with: rows.slice().sort(getComparator(order, orderBy)) */}
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.name)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.name}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                    onClick={(event) => handleClick(event, row.name)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.name}
                    </TableCell>
                  </TableRow>
                )
              })}
            {emptyRows > 0 && (
              <TableRow
                sx={{
                  height: 53 * emptyRows
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        page={page}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default EnhancedTable
