/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {useContext, useState} from 'react';
import {CSSProperties} from '@mui/material/styles/createTypography';
import Delete from '@mui/icons-material/Delete';
import AddCircle from '@mui/icons-material/AddCircle';
import Payment from '@mui/icons-material/Payment';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import {CartContext, ShopContext} from '../store';
import {addOrder} from '../actions/shopAction';
import {COMPLETE_MESSAGE, NOCART_MESSAGE} from '../constants';
import {clearToCart, delPoint, addPoint, addToCart, delToCart} from '../actions/cartAction';
import {CartItem, MusicItem} from '../types';
import {useCartCalculations} from '../hooks/useCartCalculations';
import {useFormValidation} from '../hooks/useFormValidation';

const cartClass: CSSProperties = {
  margin: '0.5rem',
  display: 'grid',
  justifyContent: 'center',
  paddingTop: '0.1rem'
};
const dialogClass: CSSProperties = {
  textAlign: 'center',
  fontWeight: 'bold',
  mx: 0.5,
  fontSize: 16,
};

// Sub-component extracted within the same file for simplicity, 
// though ideally should be in its own file.
const CartItemRow: React.FC<{
    item: CartItem;
    onAdd: (item: MusicItem) => void;
    onDelete: (item: CartItem) => void;
}> = ({item, onAdd, onDelete}) => (
  <Container
    sx={{display: 'flex', alignItems: 'center', margin: '0.1rem'}}>
    <img src={item.item.imageUrl} width='45px' height='45px' alt={item.item.title} />
    <Container sx={{width: '600px', marginLeft: '0.2rem'}}>
      <p className='cart_item'>{item.item.title}</p>
    </Container>
    <p className='cart_artist'>{item.item.artist}</p>
    <p className='cart_price'>${item.item.price}</p>
    <p className='cart_qty'>{item.qty}</p>
    <IconButton
      aria-label="Delete"
      color='primary'
      size='small'
      onClick={() => onDelete(item)}>
      <Delete />
    </IconButton>
    <IconButton
      aria-label="Add"
      color='primary'
      size='small'
      disabled={item.item.stock <= item.qty}
      onClick={() => onAdd(item.item)}>
      <AddCircle />
    </IconButton>
  </Container>
);

export const Cart: React.FC = () => {
  const {state, dispatch} = useContext(CartContext);
  const dispatchShop = useContext(ShopContext).dispatch;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const {
    checked,
    setChecked,
    totalPrices,
    calcTotalPayment,
    calcRemainingPoint,
    calcEarnedPoint
  } = useCartCalculations(state.cart, state.point);

  const mailAddr = useFormValidation('');
  const recipientAddr = useFormValidation('');

  const initUi = (): void => {
    setChecked(false);
    setOpen(false);
    // Resetting form values or validation state is tricky here without exposing reset methods
    // from useFormValidation, but for now we keep the values as per original logic/UX pattern.
    // If reset is needed:
    // mailAddr.setValue(''); mailAddr.setError(false);
    // recipientAddr.setValue(''); recipientAddr.setError(false);
  };

  const handleOk = (): void => {
    const isMailValid = mailAddr.validate();
    const isAddrValid = recipientAddr.validate();

    if (!isMailValid || !isAddrValid) {
      return;
    }

    if (checked) {
      dispatch(delPoint(totalPrices));
    } else {
      dispatch(addPoint(calcEarnedPoint(false))); // Logic based on original code
    }
    dispatch(clearToCart());
    initUi();
    dispatchShop(addOrder({
      total: totalPrices,
      payment: calcTotalPayment(checked),
      detail: state.cart
    }));
    setMessage(COMPLETE_MESSAGE);
  };

  if (state.cart.length === 0) {
    return (
      <Container sx={cartClass}>
        <Dialog open={message !== ''} onClose={() => setMessage('')}>
          <DialogTitle>Complete</DialogTitle>
          <DialogContent>
            <DialogContentText>{message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMessage('')} color='primary'>Close</Button>
          </DialogActions>
        </Dialog>
        {NOCART_MESSAGE}
      </Container>
    );
  }

  return (
    <Container sx={cartClass}>
      <p className='cart_title'>In your cart</p>
      <Container sx={{marginTop: '0.1rem'}}>
        {state.cart.map((c: CartItem) => (
          <CartItemRow
            key={c.item.id}
            item={c}
            onAdd={(item) => dispatch(addToCart(item))}
            onDelete={(item) => dispatch(delToCart(item))}
          />
        ))}
      </Container>
      <Container
        sx={{
          marginTop: '0.5rem',
          fontSize: '1.2rem',
          color: '#c9171e',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
        Total Amount: ${totalPrices}
        <Button
          variant='outlined'
          color='primary'
          onClick={() => setOpen(true)}
          startIcon={<Payment />}
          sx={{marginLeft: '2.0rem'}}>
          Buy
        </Button>
      </Container>
      <Dialog open={open} onClose={() => initUi()}>
        <DialogTitle>{'Confirm'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={dialogClass}>
            <span style={{color: '#1976d2'}}> Your Point: ${calcRemainingPoint(checked)} </span>
            <FormControlLabel
              sx={{paddingLeft: '1rem'}}
              disabled={state.point <= 0}
              control={<Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} name='points' />}
              label='Use Points' />
          </DialogContentText>
          <FormGroup sx={{marginLeft: '0.5rem'}}>
            <TextField
              id='email-address'
              label='Email'
              margin='dense'
              sx={{m: 1, width: '50ch'}}
              type='email'
              variant='standard'
              inputRef={mailAddr.ref}
              value={mailAddr.value}
              error={mailAddr.error}
              helperText={mailAddr.helperText}
              inputProps={{required: true}}
              onChange={mailAddr.handleChange}
              required />
            <TextField
              id='recipient-address'
              label='Address'
              margin='dense'
              sx={{m: 1, width: '50ch'}}
              variant='standard'
              inputRef={recipientAddr.ref}
              value={recipientAddr.value}
              error={recipientAddr.error}
              helperText={recipientAddr.helperText}
              inputProps={{required: true}}
              onChange={recipientAddr.handleChange}
              required />
          </FormGroup>
        </DialogContent>
        <DialogContent>
          <DialogContentText sx={{...dialogClass, color: 'success.dark'}}>
            Total Amount: ${calcTotalPayment(checked)}
          </DialogContentText>
          <DialogContentText sx={{marginTop: '1.5rem', textAlign: 'center'}}>
            Would you like to buy?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => initUi()}>Cancel</Button>
          <Button onClick={handleOk}>OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
