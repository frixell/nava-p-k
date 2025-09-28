import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

// Our custom InputProps can extend MUI's TextFieldProps
interface InputProps extends TextFieldProps {}

const Input: React.FC<InputProps> = (props) => {
    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            {...props}
        />
    );
};

export default Input;