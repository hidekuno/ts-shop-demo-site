import {useState, useRef, ChangeEvent} from 'react';

export const useFormValidation = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    if (ref.current) {
      const isValid = ref.current.validity.valid;
      setError(!isValid);
      return isValid;
    }
    return true; // refがない場合は検証スキップ（成功扱い）
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const isValid = e.target.validity.valid;
    setError(!isValid);
  };

  return {
    value,
    setValue,
    error,
    setError,
    ref,
    handleChange,
    validate,
    helperText: error && ref.current ? ref.current.validationMessage : undefined
  };
};
