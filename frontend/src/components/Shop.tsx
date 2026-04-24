/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {useEffect, useState, useContext, useMemo, useCallback} from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import {useErrorSnackbar} from '../hooks/useErrorSnackbar';

import {addToCart} from '../actions/cartAction';
import {addViewedAction} from '../actions/shopAction';
import {CartContext, ShopContext, makeStock, initMusicItem, MusicItem} from '../store';
import {apiFetch} from '../api';
import {MusicItemResponse} from '../types';
import {toMusicItem} from '../utils';
import {ProductItem} from './ProductItem';
import {ProductDialog} from './ProductDialog';

export const Shop: React.FC = () => {
  const [category, setCategory] = useState<string>('cd');
  const cartDispatch = useContext(CartContext).dispatch;
  const cartState = useContext(CartContext).state;
  const shopDispatch = useContext(ShopContext).dispatch;
  const shopState = useContext(ShopContext).state;
  const [rawData, setRawData] = useState<MusicItem[]>([]);
  const data = useMemo(() => makeStock(rawData, shopState.order, cartState.cart), [rawData, shopState.order, cartState.cart]);
  const [open, setOpen] = useState<boolean>(false);
  const [work, setWork] = useState<MusicItem>(initMusicItem());
  const [openAddCart, setOpenAddCart] = useState<boolean>(false);
  const {errorMessage, showError, clearError} = useErrorSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await apiFetch(`/items?category=${category}`);
        setRawData(jsonData
          .map((item: MusicItemResponse) => toMusicItem(item))
          .sort((a: MusicItem, b: MusicItem) => a.id - b.id)
        );
      } catch (err: unknown) {
        showError(err);
      }
    };
    fetchData();
  }, [category]);

  const handleChange = useCallback((event: SelectChangeEvent<string>) => {
    setCategory(event.target.value as string);
  }, []);

  const handleView = useCallback(async (item: MusicItem) => {
    setWork(item);
    setOpen(true);
    try {
      const viewedRes = await apiFetch('/views', {
        method: 'POST',
        body: JSON.stringify({music_item_id: item.id}),
      });
      shopDispatch(addViewedAction({
        datetime: viewedRes.viewed_datetime,
        item: item
      }));
    } catch (err) {
      showError(err);
    }
  }, [shopDispatch]);

  const handleAddToCart = useCallback((item: MusicItem) => {
    setOpenAddCart(true);
    cartDispatch(addToCart(item));
  }, [cartDispatch]);

  return (
    <Container sx={{height: '625px', overflowY: 'auto'}}>
      <Snackbar
        open={errorMessage !== ''}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert severity='error' onClose={clearError} variant='filled'>{errorMessage}</Alert>
      </Snackbar>
      <ProductDialog open={open} item={work} onClose={() => setOpen(false)} />

      <Select
        labelId='demo-simple-select-label'
        sx={{height: 25, marginLeft: '50%', marginBottom: '1%'}}
        onChange={handleChange}
        value={category}
        data-testid="select-element"
        id='demo-simple-select'>
        <MenuItem value={'cd'}>CD</MenuItem>
        <MenuItem value={'lp'}>LP</MenuItem>
        <MenuItem value={'mp3'}>MP3</MenuItem>
      </Select>
      <Grid container rowSpacing={1}>
        {data.map((item) => (
          <ProductItem
            key={item.id}
            item={item}
            onView={handleView}
            onAddToCart={handleAddToCart}
          />
        ))}
      </Grid>
      <Snackbar
        open={openAddCart}
        autoHideDuration={1000}
        onClose={() => setOpenAddCart(false)}
        sx={{height: '100%'}}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert severity='success'>Added to cart.</Alert>
      </Snackbar>
    </Container>
  );
};
