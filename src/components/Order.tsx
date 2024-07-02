/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {Fragment, useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import {ShopContext,OrderItem} from '../store';
import {PAGE_COUNT} from '../constants';

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#898989',
    color: theme.palette.common.white,
    paddingTop: 5,
    paddingBottom: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 5,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    color: theme.palette.common.white,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const pageInfo = (order: OrderItem[]) => {
  let s = 0;
  const r = [0];

  for (let i = 0; i < order.length; i++) {
    s += order[i].detail.length;
    if (s >= PAGE_COUNT && (i + 1) !== order.length) {
      r.push(i + 1);
      s = 0;
    }
  }
  return r;
};

export const Order: React.FC = () => {
  const state = useContext(ShopContext).state;
  const order: OrderItem[] = state.order;
  const dollar = (n: number): string => '$' + n;
  const rowspan = (row: OrderItem): number => row.detail.length + 1;

  const [page, setPage] = useState(1);
  const pages = pageInfo(order);
  const pageCount = pages.length;
  const getViewData = () => order.slice(pages[page - 1], pages[page]);
  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => setPage(page);

  return (
    <TableContainer>
      <p className='order_title'>Order History</p>
      {
        pageCount > 1 &&
        <Stack spacing={2} sx={{alignItems: 'center', justifyContent: 'center'}}>
          <Pagination count={pageCount} page={page} color="primary" size="small" onChange={handleChange} />
        </Stack>
      }
      <Table stickyHeader sx={{minWidth: 750, tableLayout: 'fixed'}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{width: 150}}>Order No.</StyledTableCell>
            <StyledTableCell style={{width: 140}}>Order Date Time</StyledTableCell>
            <StyledTableCell style={{width: 40}}>Payment</StyledTableCell>
            <StyledTableCell style={{width: 40}}>Total</StyledTableCell>
            <StyledTableCell style={{width: 30}}>Title</StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell style={{width: 30}} align="right">Price</StyledTableCell>
            <StyledTableCell style={{width: 30}} align="right">Qty</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getViewData().map((row, index) => (
            <Fragment key={index}>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" rowSpan={rowspan(row)}>
                  {row.orderno}
                </StyledTableCell>
                <StyledTableCell rowSpan={rowspan(row)}>{row.orderDatetime}</StyledTableCell>
                <StyledTableCell rowSpan={rowspan(row)} align="right">{dollar(row.payment)}</StyledTableCell>
                <StyledTableCell rowSpan={rowspan(row)} align="right">{dollar(row.total)}</StyledTableCell>
              </StyledTableRow>
              {row.detail.map((detail, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell><img src={detail.item.imageUrl} width='30px' height='30px' /></StyledTableCell>
                  <StyledTableCell>{detail.item.title}</StyledTableCell>
                  <StyledTableCell align="right">{dollar(detail.item.price)}</StyledTableCell>
                  <StyledTableCell align="right">{detail.qty}</StyledTableCell>
                </StyledTableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
