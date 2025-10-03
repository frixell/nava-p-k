import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface TeachingToolbarProps {
  isAuthenticated: boolean;
  language: string;
  onAddTeach(): void;
  onOpenSeo(): void;
  onLogout(): void;
}

const TeachingToolbar: React.FC<TeachingToolbarProps> = ({
  isAuthenticated,
  language,
  onAddTeach,
  onOpenSeo,
  onLogout
}) => {
  if (!isAuthenticated) {
    return null;
  }

  const isHebrew = language === 'he';

  return (
    <Stack direction="row" spacing={1} justifyContent={isHebrew ? 'flex-start' : 'flex-end'}>
      <Button variant="outlined" onClick={onLogout}>
        {isHebrew ? 'יציאה' : 'Logout'}
      </Button>
      <Button variant="outlined" onClick={onOpenSeo}>
        {isHebrew ? 'קידום' : 'SEO'}
      </Button>
      <Button variant="contained" onClick={onAddTeach}>
        {isHebrew ? 'הוספה' : 'Add teach'}
      </Button>
    </Stack>
  );
};

export default TeachingToolbar;
