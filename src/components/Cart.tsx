/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {useRef, useState, useContext} from 'react';
import {CSSProperties} from '@mui/material/styles/createTypography';
import Delete from '@mui/icons-material/Delete';
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
import {clearToCart, delPoint, addPoint,delToCart} from '../actions/cartAction';
import {CartAction, CartState}  from '../reducers/cartReducer';
import {CartItem} from '../data';

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
class Sale {
  cartItems: CartItem[];

  userPoint: number;

  totalPrices: number;

  constructor(state: CartState) {
    this.cartItems = state.cart;
    this.userPoint = state.point;
    this.totalPrices = this.cartItems.map((c) => c.item.price * c.qty).reduce((a, b) => a + b, 0);
  }

  calcTotalPrices(checked: boolean): number {
    const result = checked ? this.totalPrices - this.userPoint : this.totalPrices;
    return result < 0 ? 0 : result;
  }

  calcPoint(checked: boolean): number {
    const result = checked ? this.userPoint - this.totalPrices : this.userPoint;
    return result < 0 ? 0 : result;
  }

  dispatchWrap(dispatch: React.Dispatch<CartAction>, checked: boolean): void {
    if (checked) {
      dispatch(delPoint(this.totalPrices));
    } else {
      dispatch(addPoint(Math.floor(this.totalPrices / 10)));
    }
    dispatch(clearToCart());
  }
}
class TextValidation {
  value: string;

  setValue: React.Dispatch<React.SetStateAction<string>>;

  error: boolean;

  setError: React.Dispatch<React.SetStateAction<boolean>>;

  ref: React.RefObject<HTMLInputElement>;

  constructor(value: [string,React.Dispatch<React.SetStateAction<string>>],
    error: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    ref: React.RefObject<HTMLInputElement>) {
    this.value = value[0];
    this.setValue = value[1];
    this.error = error[0];
    this.setError = error[1];
    this.ref = ref;
  }

  validateText(): boolean {
    const v = this.ref.current!.validity.valid;
    this.setError(!v);
    return v;
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): boolean {
    this.setValue(e.target.value);
    return this.validateText();
  }

  helpText(): string | undefined {
    return this.error ? this.ref.current!.validationMessage : undefined;
  }
}
export const Cart: React.FC = () => {
  const {state, dispatch} = useContext(CartContext);
  const dispatchShop = useContext(ShopContext).dispatch;

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState('');

  const sale = new Sale(state);
  const mailAddr = new TextValidation(useState(''), useState(false), useRef<HTMLInputElement>(null));
  const recipientAddr = new TextValidation(useState(''), useState(false),useRef<HTMLInputElement>(null));

  const initUi = (): void => {
    setChecked(false);
    setOpen(false);
  };

  const handleOk = (): void => {
    const validate = (): boolean => {
      let v = mailAddr.validateText();
      v &&= recipientAddr.validateText();
      return v;
    };
    if (!validate()) {
      return;
    }
    sale.dispatchWrap(dispatch, checked);
    initUi();
    dispatchShop(addOrder({total: sale.totalPrices, payment: sale.calcTotalPrices(checked), detail: sale.cartItems}));
    setMessage(COMPLETE_MESSAGE);
  };

  if (sale.cartItems.length === 0) {
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

  const cart = sale.cartItems.map((c: CartItem) => (
    <Container
      key={c.item.id}
      sx={{display: 'flex', alignItems: 'center', margin: '0.1rem'}}>
      <img src={c.item.imageUrl} width='45px' height='45px' alt={c.item.title} />
      <Container sx={{width: '600px', marginLeft: '0.2rem'}}>
        <p className='cart_item'>{c.item.title}</p>
      </Container>
      <p className='cart_artist'>{c.item.artist}</p>
      <p className='cart_price'>${c.item.price}</p>
      <p className='cart_qty'>{c.qty}</p>
      <IconButton
        aria-label="Delete"
        color='primary'
        size='small'
        onClick={() => { dispatch(delToCart(c)); }}>
        <Delete />
      </IconButton>
    </Container>
  ));
  return (
    <Container sx={cartClass}>
      <p className='cart_title'>In your cart</p>
      <Container sx={{marginTop: '0.1rem'}}>{cart}</Container>
      <Container
        sx={{
          marginTop: '0.5rem',
          fontSize: '1.2rem',
          color: '#c9171e',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
        Total Amount: ${sale.totalPrices}
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
            <span style={{color: '#1976d2'}}> Your Point: ${sale.calcPoint(checked)} </span>
            <FormControlLabel
              sx={{paddingLeft: '1rem'}}
              disabled={sale.userPoint <= 0}
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
              helperText={mailAddr.helpText()}
              inputProps={{required: true}}
              onChange={(e) => { mailAddr.handleChange(e); } }
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
              helperText={recipientAddr.helpText()}
              inputProps={{required: true}}
              onChange={(e) => { recipientAddr.handleChange(e); } }
              required />
          </FormGroup>
        </DialogContent>
        <DialogContent>
          <DialogContentText sx={{...dialogClass, color: 'success.dark'}}>
            Total Amount: ${sale.calcTotalPrices(checked)}
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
