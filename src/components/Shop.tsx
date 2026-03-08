/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {useEffect, useState, useContext, useMemo} from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';

import {addToCart} from '../actions/cartAction';
import {addViewed} from '../actions/shopAction';
import {CartContext, ShopContext, makeStock, initMusicItem, MusicItem} from '../store';
import {FETCH_TIMEOUT, BAD_REQUEST, JSON_INIT_VAL} from '../constants';
import {ProductItem} from './ProductItem';
import {ProductDialog} from './ProductDialog';

export const Shop: React.FC = () => {
  const [state, setState] = useState<string>(JSON_INIT_VAL);
  const cartDispatch = useContext(CartContext).dispatch;
  const cartState = useContext(CartContext).state;
  const shopDispatch = useContext(ShopContext).dispatch;
  const shopState = useContext(ShopContext).state;
  const [rawData, setRawData] = useState<MusicItem[]>([]);
  const data = useMemo(() => makeStock(rawData, shopState.order, cartState.cart), [rawData, shopState.order, cartState.cart]);
  const [open, setOpen] = useState<boolean>(false);
  const [work, setWork] = useState<MusicItem>(initMusicItem());
  const [error, setError] = useState<string>('');
  const [openAddCart, setOpenAddCart] = useState<boolean>(false);

  useEffect(() => {
    // console.log("useEffect");
    const fetchData = async () => {
      try {
        const response = await fetch(state, {signal: AbortSignal.timeout(FETCH_TIMEOUT)});

        if (response.status >= BAD_REQUEST) {
          throw new Error(response.status + ' error');
        }
        const jsonData = await response.json();

        setRawData(jsonData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error('fetch error!', err);
        } else {
          console.error('Unexpected error', err);
        }
      }
    };
    fetchData();
  }, [state]);

  const handleChange = (event: SelectChangeEvent<string>) => setState(event.target.value as string);

  const handleView = (item: MusicItem) => {
    setWork(item);
    setOpen(true);
    shopDispatch(addViewed(item));
  };

  const handleAddToCart = (item: MusicItem) => {
    setOpenAddCart(true);
    cartDispatch(addToCart(item));
  };

  return (
    <Container sx={{height: '625px', overflowY: 'auto'}}>
      {error.length > 0 ? (
        <Alert variant='outlined' severity='error' onClose={() => setError('')}>
          {error}
        </Alert>
      ) : (
        <></>
      )}
      <ProductDialog open={open} item={work} onClose={() => setOpen(false)} />

      <Select
        labelId='demo-simple-select-label'
        sx={{height: 25, marginLeft: '50%'}}
        onChange={handleChange}
        value={state}
        data-testid="select-element"
        id='demo-simple-select'>
        <MenuItem value={'cd.json'}>CD</MenuItem>
        <MenuItem value={'lp.json'}>LP</MenuItem>
        <MenuItem value={'mp3.json'}>MP3</MenuItem>
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
