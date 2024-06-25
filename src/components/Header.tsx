/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {useContext, useState, useEffect} from 'react';
import Link from '@mui/material/Link';
import {useNavigate, useLocation} from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import Shop from '@mui/icons-material/Shop';
import BrowseGallery from '@mui/icons-material/BrowseGallery';
import Paid from '@mui/icons-material/Paid';
import Badge, {BadgeProps} from '@mui/material/Badge';
import {styled} from '@mui/material/styles';

import '../App.css';
import {ShopContext, CartContext} from '../store';

interface HeaderProps {
  index: number;
}

interface Links {
  path: string;
  label: string;
  icon: () => React.ReactElement;
}

const menuLinks: Links[] = [
  {path:'/shop', label: 'Shop', icon:() => <Shop />,},
  {path:'/viewed', label: 'Viewed', icon:() => <BrowseGallery />,},
  {path:'/cart', label: 'Cart', icon:() => <ShoppingCart />,},
  {path:'/order', label: 'Order', icon:() => <Paid />,},
];

const StyledBadge = styled(Badge)<BadgeProps>(({theme}) => ({
  '& .MuiBadge-badge': {
    right: 73,
    top: 8,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export const Header: React.FC<HeaderProps> = (props) => {
  const path = useLocation().pathname;
  const state = useContext(ShopContext).state;
  const cart = useContext(CartContext).state;
  const navigate = useNavigate();
  const menubar: React.CSSProperties = {minHeight: '20px', height: '20px', marginLeft: '10px'};
  const [value, setValue] = useState<number>(props.index);

  const handleTabChange = (_event: React.ChangeEvent<object>, newValue: number) => {
    setValue(newValue);
    navigate(menuLinks[newValue].path);
  };

  useEffect(() => {
    if (!state.username) {
      navigate('/');
    }
  }, [state.username, navigate]);


  const getTabs = (row: Links, index: number) => {
    if (row.label === 'Cart' && cart.cart.length > 0) {
      return (
        <Tab label={<StyledBadge badgeContent={cart.cart.length} color="secondary">Cart</StyledBadge>}
          icon={row.icon()} component="a" iconPosition="start" sx={{...menubar,}} key={index}/>
      );
    } else {
      return (
        <Tab label={row.label} icon={row.icon()} component="a" iconPosition="start" sx={{...menubar,}} key={index}/>
      );
    }
  };

  return (
    <>
      {menuLinks.map((row) => row.path).slice(0, 4).includes(path) &&
        <header className="header">
          CD Shop <i><b>Demo</b></i> Site
          <Tabs sx={{...menubar, marginLeft: '5%'}} value={value} onChange={handleTabChange} aria-label="menu">
            {menuLinks.map((row,index) => ( getTabs(row,index) ))}
          </Tabs>
          <p className='shop_username'>{state.username}</p>
          <span style={{fontWeight: 'bold', color: '#e3811e'}}>Your Point: {cart.point}</span>
          <Link underline='hover' href='' onClick={() => navigate('/')}>Sign out</Link>
        </header>
      }
    </>
  );
};
