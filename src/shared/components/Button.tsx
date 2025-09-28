import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';

// Our custom ButtonProps can extend MUI's to allow for full customization
interface ButtonProps extends MuiButtonProps {
    // We can add our own custom props here if needed in the future
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
    return (
        <MuiButton variant="contained" {...rest}>
            {children}
        </MuiButton>
    );
};

export default Button;