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

import {ShopContext, ViewedItem} from '../store';
import {ViewedItemResponse} from '../types';
import {setViews} from '../actions/shopAction';
import {PAGE_COUNT} from '../constants';
import {apiFetch} from '../api';
import {formatDate, dollar, toMusicItem} from '../utils';
import {StyledTableCell, StyledTableRow} from './StyledTable';
import {useErrorSnackbar} from '../hooks/useErrorSnackbar';

const calcPage = (len: number) => (len > PAGE_COUNT) ? Math.ceil(len / PAGE_COUNT) : 1;

const getViewData = (views: ViewedItem[], page:number) => views.slice((page - 1) * PAGE_COUNT, page * PAGE_COUNT);

export const Viewed: React.FC = () => {
  const {state, dispatch} = useContext(ShopContext);
  const views: ViewedItem[] = state.views;
  const {errorMessage, showError, clearError} = useErrorSnackbar();
  const [page, setPage] = useState(1);
  const pageCount = calcPage(views.length);
  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => setPage(page);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const data = await apiFetch('/views');
        dispatch(setViews(data.map((v: ViewedItemResponse) => ({
          datetime: v.viewed_datetime,
          item: toMusicItem(v.item),
        }))));
      } catch (err) {
        showError(err);
      }
    };
    fetchViews();
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
      <p className='order_title'>Viewed Item History</p>
      {
        pageCount > 1 &&
        <Stack spacing={2} sx={{alignItems: 'center', justifyContent: 'center'}}>
          <Pagination count={pageCount} page={page} color="primary" size="small" onChange={handleChange} />
        </Stack>
      }
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
          {getViewData(views,page).map((row) => (
            <Fragment key={`${row.datetime}-${row.item.id}`}>
              <StyledTableRow>
                <StyledTableCell>{formatDate(row.datetime)}</StyledTableCell>
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
