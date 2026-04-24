/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {Fragment, useContext, useState, useEffect} from 'react';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import {ShopContext, OrderItem} from '../store';
import {OrderItemResponse, CartItemResponse} from '../types';
import {setOrders} from '../actions/shopAction';
import {PAGE_COUNT} from '../constants';
import {apiFetch} from '../api';
import {formatDate, dollar, toMusicItem} from '../utils';
import {StyledTableCell, StyledTableRow} from './StyledTable';
import {useErrorSnackbar} from '../hooks/useErrorSnackbar';

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
  const {state, dispatch} = useContext(ShopContext);
  const order: OrderItem[] = state.order;
  const rowspan = (row: OrderItem): number => row.detail.length + 1;
  const {errorMessage, showError, clearError} = useErrorSnackbar();

  const [page, setPage] = useState(1);
  const pages = pageInfo(order);
  const pageCount = pages.length;
  const getViewData = () => order.slice(pages[page - 1], pages[page]);
  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => setPage(page);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiFetch('/orders');
        dispatch(setOrders(data.map((o: OrderItemResponse) => ({
          orderno: o.order_no,
          orderDatetime: o.order_datetime,
          total: o.total,
          payment: o.payment,
          detail: o.detail.map((d: CartItemResponse) => ({
            item: toMusicItem(d.item),
            qty: d.qty
          }))
        }))));
      } catch (err) {
        showError(err);
      }
    };
    fetchOrders();
  }, [dispatch]);

  return (
    <TableContainer>
      <Snackbar
        open={errorMessage !== ''}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert severity='error' onClose={clearError} variant='filled'>{errorMessage}</Alert>
      </Snackbar>
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
          {getViewData().map((row) => (
            <Fragment key={row.orderno}>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" rowSpan={rowspan(row)}>
                  {row.orderno}
                </StyledTableCell>
                <StyledTableCell rowSpan={rowspan(row)}>{formatDate(row.orderDatetime)}</StyledTableCell>
                <StyledTableCell rowSpan={rowspan(row)} align="right">{dollar(row.payment)}</StyledTableCell>
                <StyledTableCell rowSpan={rowspan(row)} align="right">{dollar(row.total)}</StyledTableCell>
              </StyledTableRow>
              {row.detail.map((detail) => (
                <StyledTableRow key={detail.item.id}>
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
