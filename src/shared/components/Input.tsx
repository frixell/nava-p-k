import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type InputProps = TextFieldProps;

const Input: React.FC<InputProps> = (props) => {
  return <TextField variant="outlined" margin="normal" fullWidth {...props} />;
};

export default Input;
