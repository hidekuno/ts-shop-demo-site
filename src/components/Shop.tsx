/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';

import { addToCart } from '../actions/cartAction';
import { CartContext } from '../store';
import { FETCH_TIMEOUT, BAD_REQUEST, JSON_INIT_VAL } from '../constants';
import { MusicItem } from '../data';

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  zIndex: theme.zIndex.tooltip + 1,
  '& .MuiTooltip-tooltip': {
    maxWidth: '200px',
    fontFamily: 'Helvetica',
    fontSize: '12px',
    backgroundColor: 'rgba(255,255,255)',
    margin: '4px',
    padding: '8px',
    whiteSpace: 'pre-line'
  }
}));

const tooltipTop = {
  '& .MuiTooltip-tooltip': {
    border: 'solid skyblue 1px',
    color: 'black'
  }
};

export const Shop: React.FC = () => {
  const [state, setState] = useState<string>(JSON_INIT_VAL);
  const dispatch = useContext(CartContext).dispatch;
  const [data, setData] = useState<MusicItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [work, setWork] = useState<MusicItem>({ id: 0, title: '', artist: '', imageUrl: '', description: '', price: 0 });
  const [error, setError] = useState<string>('');
  const [openAddCart, setOpenAddCart] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(state, { signal: AbortSignal.timeout(FETCH_TIMEOUT) });

        if (response.status >= BAD_REQUEST) {
          throw new Error(response.status + ' error');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err.message);
        console.error('fetch error!', err);
      }
    };
    fetchData();
  }, [state]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setState(event.target.value as string);
  };

  return (
    <Container sx={{ height: '625px', overflowY: 'auto' }}>
      {error.length > 0 ? (
        <Alert variant='outlined' severity='error' onClose={() => setError('')}>
          {error}
        </Alert>
      ) : (
        <></>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ paddingBottom: 0 }}>{work.title}</DialogTitle>
        <DialogContentText sx={{ marginLeft: '2.0rem', fontSize: 14 }}>{work.artist}</DialogContentText>
        <DialogContent>
          <Stack direction='row' spacing={2}>
            <Box component='img' sx={{ maxWidth: '320px', maxHeight: '320px' }} alt={work.title} src={work.imageUrl} />
            <DialogContentText sx={{ fontSize: 12 }}>{work.description}</DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Select
        labelId='demo-simple-select-label'
        sx={{ height: 25, marginLeft: '50%' }}
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
          <Grid item xs={2} key={item.id}>
            <Box
              sx={{
                padding: '0.5rem',
                borderBottom: '1px solid #d0d0d0',
                boxShadow: '1px 1px 3px #b1b1b1',
                textAlign: 'center'
              }}
            >
              <StyledTooltip arrow title={'Please click'} placement='bottom' sx={tooltipTop}>
                <Box
                  component='img'
                  sx={{ width: '120px', height: '120px' }}
                  alt={item.title}
                  src={item.imageUrl}
                  onClick={() => {
                    setWork(item);
                    setOpen(true);
                  }}
                />
              </StyledTooltip>
              <Stack direction='row' sx={{ marginTop: '0.2rem', alignItems: 'center', justifyContent: 'center' }}>
                <p className='shop_price'>${item.price}</p>
                <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  sx={{ marginLeft: '1.8rem' }}
                  startIcon={<AddShoppingCart />}
                  onClick={() => {
                    setOpenAddCart(true);
                    dispatch(addToCart(item));
                  }}
                >
                  Cart
                </Button>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={openAddCart}
        autoHideDuration={3000}
        onClose={() => setOpenAddCart(false)}
        sx={{ height: '100%' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity='success'>Added to cart.</Alert>
      </Snackbar>
    </Container>
  );
};
