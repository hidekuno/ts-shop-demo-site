/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {Fragment, useContext} from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {ShopContext,ViewedItem} from '../store';

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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

export const Viewed: React.FC = () => {
  const state = useContext(ShopContext).state;
  const order: ViewedItem[] = state.views;
  const dollar = (n: number): string => '$' + n;

  return (
    <TableContainer component={Paper}>
      <p className='order_title'>Viewed Item History</p>
      <Table stickyHeader sx={{minWidth: 750, tableLayout: 'fixed'}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{width: 140}}>Viewed Date Time</StyledTableCell>
            <StyledTableCell style={{width: 30}}>Title</StyledTableCell>
            <StyledTableCell style={{width: 500}}></StyledTableCell>
            <StyledTableCell >Artist</StyledTableCell>
            <StyledTableCell style={{width: 30}} align="right">Price</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.map((row, index) => (
            <Fragment key={index}>
              <StyledTableRow>
                <StyledTableCell>{row.datetime}</StyledTableCell>
                <StyledTableCell><img src={row.item.imageUrl} width='30px' height='30px' /></StyledTableCell>
                <StyledTableCell>{row.item.title}</StyledTableCell>
                <StyledTableCell>{row.item.artist}</StyledTableCell>
                <StyledTableCell align="right">{dollar(row.item.price)}</StyledTableCell>
              </StyledTableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
