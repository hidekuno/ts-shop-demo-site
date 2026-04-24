/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {useContext} from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useNavigate} from 'react-router-dom';
import {useErrorSnackbar} from '../hooks/useErrorSnackbar';

import {ShopContext} from '../store';
import {setUser} from '../actions/shopAction';
import {apiFetch, setAuthToken} from '../api';

export const Signin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useContext(ShopContext).dispatch;
  const {errorMessage, showError, clearError} = useErrorSnackbar();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username') as string;
    const password = data.get('password') as string;

    try {
      // 1. Get Token
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const tokenRes = await apiFetch('/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      setAuthToken(tokenRes.access_token);

      // 2. Get User Info
      const userRes = await apiFetch('/users/me');
      dispatch(setUser(userRes.username, userRes.point));

      navigate('/shop');
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        open={errorMessage !== ''}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert severity='error' onClose={clearError} variant='filled'>{errorMessage}</Alert>
      </Snackbar>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
          <LibraryMusicIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in to CD Shop <i><b>Demo</b></i> Site
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            inputProps={{maxLength: 32}}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
