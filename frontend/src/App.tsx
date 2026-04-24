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

interface PageProps {
  index: number;
  Component: React.FC;
}

const Page: React.FC<PageProps> = ({index, Component}) => {
  return (
    <div>
      <Header index={index} />
      <Container sx={{padding: '1rem'}}>
        <Component />
      </Container>
    </div>
  );
};

export const Store: React.FC = () => <Page index={0} Component={Shop} />;
export const Viewed: React.FC = () => <Page index={1} Component={ViewedPart} />;
export const Cart: React.FC = () => <Page index={2} Component={CartPart} />;
export const Order: React.FC = () => <Page index={3} Component={OrderPart} />;
