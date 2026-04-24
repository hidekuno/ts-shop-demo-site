import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import {MusicItem} from '../types';

interface ProductDialogProps {
  open: boolean;
  item: MusicItem;
  onClose: () => void;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({open, item, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{paddingBottom: 0}}>{item.title}</DialogTitle>
      <DialogContentText sx={{marginLeft: '2.0rem', fontSize: 14}}>{item.artist}</DialogContentText>
      <DialogContent style={{background: '#f4f3f1'}}>
        <Stack direction='row' spacing={2}>
          <Box component='img' sx={{maxWidth: '320px', maxHeight: '320px'}} alt={item.title} src={item.imageUrl} />
          <DialogContentText sx={{fontSize: 12}}>{item.description}</DialogContentText>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
