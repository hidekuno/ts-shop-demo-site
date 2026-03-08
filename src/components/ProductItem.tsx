import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import {styled} from '@mui/material/styles';
import {MusicItem} from '../types';

interface ProductItemProps {
  item: MusicItem;
  onView: (item: MusicItem) => void;
  onAddToCart: (item: MusicItem) => void;
}

const StyledTooltip = styled(Tooltip)(({theme}) => ({
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

export const ProductItem: React.FC<ProductItemProps> = ({item, onView, onAddToCart}) => {
  return (
    <Grid item xs={2} key={item.id}>
      <Box
        sx={{
          padding: '0.5rem',
          borderBottom: '1px solid #d0d0d0',
          boxShadow: '1px 1px 3px #b1b1b1',
          textAlign: 'center'
        }}
      >
        <StyledTooltip arrow title={'Click to view description'} placement='bottom' sx={tooltipTop}>
          <Box
            component='img'
            sx={{width: '120px', height: '120px', cursor: 'pointer'}}
            alt={item.title}
            src={item.imageUrl}
            onClick={() => onView(item)}
          />
        </StyledTooltip>
        <Stack direction='row' sx={{marginTop: '0.2rem', alignItems: 'center', justifyContent: 'center'}}>
          <p className='shop_price'>${item.price}</p>
          <Button
            variant='contained'
            color='primary'
            size='small'
            sx={{marginLeft: '1.8rem'}}
            startIcon={<AddShoppingCart />}
            disabled={item.stock <= 0}
            onClick={() => onAddToCart(item)}
          >
            Cart
          </Button>
          <p className='shop_stock'>{(item.digital === false) && item.stock}</p>
        </Stack>
      </Box>
    </Grid>
  );
};
