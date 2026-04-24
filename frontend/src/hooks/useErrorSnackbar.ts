import {useState} from 'react';

export const useErrorSnackbar = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const showError = (err: unknown) =>
    setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
  const clearError = () => setErrorMessage('');
  return {errorMessage, showError, clearError};
};
