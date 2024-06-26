/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React from 'react';
import Container from '@mui/material/Container';
import './App.css';
import {Shop} from './components/Shop';
import {Cart as CartPart} from './components/Cart';
import {Header} from './components/Header';
import {Order as OrderPart} from './components/Order';
import {Viewed as ViewedPart} from './components/Viewed';

export const Store: React.FC = () => {
  return (
    <div>
      <Header index={0} />
      <Container sx={{padding: '1rem'}}>
        <Shop />
      </Container>
    </div>
  );
};

export const Viewed: React.FC = () => {
  return (
    <div>
      <Header index={1} />
      <Container sx={{padding: '1rem'}}>
        <ViewedPart />
      </Container>
    </div>
  );
};

export const Cart: React.FC = () => {
  return (
    <div>
      <Header index={2} />
      <Container sx={{padding: '1rem'}}>
        <CartPart />
      </Container>
    </div>
  );
};

export const Order: React.FC = () => {
  return (
    <div>
      <Header index={3} />
      <Container sx={{padding: '1rem'}}>
        <OrderPart />
      </Container>
    </div>
  );
};
