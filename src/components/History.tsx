/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, { Fragment, useContext } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { ShopContext } from '../store';

interface Detail {
  title: string;
  price: number;
  qty: number;
}

interface Order {
  orderno: string;
  orderDatetime: string;
  payment: number;
  total: number;
  detail: Detail[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    color: theme.palette.common.white,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const History: React.FC = () => {
  const state = useContext(ShopContext).state;
  const order: Order[] = state.order;

  const dollar = (n: number): string => '$' + n;

  const rowspan = (row: Order): number => row.detail.length + 1;

  return (
    <TableContainer component={Paper} sx={{ height: '80vh' }}>
      <Table stickyHeader sx={{ minWidth: 750, tableLayout: 'fixed' }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{ width: 180 }}>Order No.</StyledTableCell>
            <StyledTableCell style={{ width: 140 }}>Order Date Time</StyledTableCell>
            <StyledTableCell style={{ width: 50 }}>Payment</StyledTableCell>
            <StyledTableCell style={{ width: 50 }}>Total</StyledTableCell>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell style={{ width: 30 }} align="right">Price</StyledTableCell>
            <StyledTableCell style={{ width: 30 }} align="right">Qty</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.map((row, index) => (
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
                  <StyledTableCell>{detail.title}</StyledTableCell>
                  <StyledTableCell align="right">{dollar(detail.price)}</StyledTableCell>
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
