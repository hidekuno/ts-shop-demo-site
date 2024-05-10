/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, { useContext, useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import { useNavigate, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import '../App.css';
import { ShopContext, CartContext } from '../store';

interface HeaderProps {
  index: number;
}

const menuLinks = ['/shop', '/cart', '/order'];

export const Header: React.FC<HeaderProps> = (props) => {
  const path = useLocation().pathname;
  const state = useContext(ShopContext).state;
  const cart = useContext(CartContext).state;
  const navigate = useNavigate();
  const menubar: React.CSSProperties = { minHeight: '20px', height: '20px' };
  const [value, setValue] = useState<number>(props.index);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    navigate(menuLinks[newValue]);
  };

  useEffect(() => {
    if (!state.username) {
      navigate('/');
    }
  }, [state.username, navigate]);

  return (
    <header className="header">
      CD Shop <i><b>Demo</b></i> Site
      <Tabs sx={{ ...menubar, marginLeft: '5%' }} value={value} onChange={handleTabChange} aria-label="menu">
        <Tab label='Shop' component="a" sx={{ ...menubar, width: '55px', minWidth: '55px' }} />
        <Tab label='Cart' component="a" sx={{ ...menubar, width: '55px', minWidth: '55px' }} />
        <Tab label='Order' component="a" sx={{ ...menubar, width: '60px', minWidth: '60px' }} />
      </Tabs>
      <p className='shop_username'>{state.username}</p>
      {
        menuLinks.slice(0, 2).includes(path) &&
        <span style={{ fontWeight: 'bold', color: '#e3811e' }}>Your Point: {cart.point}</span>
      }
      <Link underline='hover' href='#' onClick={() => navigate('/shop')}>Home</Link>
      <Link underline='hover' href='' onClick={() => navigate('/')}>Sign out</Link>
    </header>
  );
};
