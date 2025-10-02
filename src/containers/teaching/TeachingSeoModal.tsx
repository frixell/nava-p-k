import React from 'react';
import Modal from 'react-responsive-modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { TeachingSeo } from './types';

interface TeachingSeoModalProps {
    open: boolean;
    language: string;
    seo: TeachingSeo;
    onClose(): void;
    onChange(field: keyof TeachingSeo, value: string): void;
    onSubmit(): void;
}

const TeachingSeoModal: React.FC<TeachingSeoModalProps> = ({ open, language, seo, onClose, onChange, onSubmit }) => {
    if (!open) {
        return null;
    }

    const isHebrew = language === 'he';

    return (
        <Modal open={open} onClose={onClose} center>
            <Stack spacing={2} sx={{ minWidth: 360 }}>
                <h3 style={{ margin: 0 }}>{isHebrew ? 'נתוני SEO' : 'SEO settings'}</h3>
                <TextField
                    label={isHebrew ? 'כותרת לדף (title)' : 'Page title'}
                    value={seo.title}
                    onChange={(event) => onChange('title', event.target.value)}
                />
                <TextField
                    label={isHebrew ? 'תיאור' : 'Description'}
                    value={seo.description}
                    multiline
                    minRows={3}
                    onChange={(event) => onChange('description', event.target.value)}
                />
                <TextField
                    label={isHebrew ? 'מילות מפתח' : 'Keywords'}
                    value={seo.keyWords}
                    multiline
                    minRows={2}
                    onChange={(event) => onChange('keyWords', event.target.value)}
                />
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button variant="outlined" onClick={onClose}>
                        {isHebrew ? 'ביטול' : 'Cancel'}
                    </Button>
                    <Button variant="contained" onClick={onSubmit}>
                        {isHebrew ? 'עדכון' : 'Update'}
                    </Button>
                </Stack>
            </Stack>
        </Modal>
    );
};

export default TeachingSeoModal;
