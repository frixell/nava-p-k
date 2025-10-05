import React from 'react';
import {
  ToolbarCluster,
  ToolbarLabel,
  IconButton,
  IconImage,
  DualButtonContainer
} from './HomePageToolbar.styles';

interface HomePageToolbarProps {
  isAuthenticated: boolean;
  isEnglish: boolean;
  allowAddPoint: boolean;
  needSave: boolean;
  hasSelectedProject: boolean;
  onLogout: () => void;
  onSave: () => void;
  onToggleAddPoint: () => void;
  onToggleNewCategory: () => void;
  onStartEditCategory: () => void;
  onOpenHeroSettings: () => void;
}

const HomePageToolbar: React.FC<HomePageToolbarProps> = ({
  isAuthenticated,
  isEnglish,
  allowAddPoint,
  needSave,
  hasSelectedProject,
  onLogout,
  onSave,
  onToggleAddPoint,
  onToggleNewCategory,
  onStartEditCategory,
  onOpenHeroSettings
}) => {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <ToolbarCluster isEnglish={isEnglish} alignEnglish={90} alignHebrew={10} zIndexLevel={15007}>
        <ToolbarLabel>{isEnglish ? 'Exit' : 'יציאה'}</ToolbarLabel>
        <IconButton onClick={onLogout} aria-label={isEnglish ? 'Exit' : 'יציאה'}>
          <IconImage src="/images/backoffice/exit.svg" alt="" />
        </IconButton>
      </ToolbarCluster>

      <ToolbarCluster isEnglish={isEnglish} alignEnglish={83} alignHebrew={17} zIndexLevel={15008}>
        {hasSelectedProject ? (
          <>
            <ToolbarLabel tone={needSave ? 'alert' : 'default'}>
              {isEnglish ? 'Save' : 'שמירה'}
            </ToolbarLabel>
            <IconButton onClick={onSave} aria-label={isEnglish ? 'Save project' : 'שמירה'}>
              <IconImage src="/images/backoffice/save.svg" alt="" />
            </IconButton>
          </>
        ) : (
          <>
            <ToolbarLabel tone={allowAddPoint ? 'alert' : 'default'} width="7rem">
              {isEnglish ? 'Add project' : 'הוספת פרוייקט'}
            </ToolbarLabel>
            <IconButton
              onClick={onToggleAddPoint}
              aria-label={isEnglish ? 'Add project' : 'הוספת פרוייקט'}
            >
              <IconImage
                variant="accent"
                src="/images/eventspage/add-eventSubcategory-icon.svg"
                alt=""
              />
            </IconButton>
          </>
        )}
      </ToolbarCluster>

      <ToolbarCluster isEnglish={isEnglish} alignEnglish={76} alignHebrew={24} zIndexLevel={15009}>
        <ToolbarLabel width="9rem" align="center" paddingLeft={isEnglish ? '0.6rem' : undefined}>
          {isEnglish ? 'Manage categories' : 'ניהול קטגוריות'}
        </ToolbarLabel>
        <DualButtonContainer>
          <IconButton
            onClick={onToggleNewCategory}
            aria-label={isEnglish ? 'Add category' : 'הוספת קטגוריה'}
          >
            <IconImage
              variant="accent"
              src="/images/eventspage/add-eventSubcategory-icon.svg"
              alt=""
            />
          </IconButton>
          <IconButton
            onClick={onStartEditCategory}
            aria-label={isEnglish ? 'Edit categories' : 'עריכת קטגוריות'}
          >
            <IconImage variant="accent" src="/images/backoffice/edit.svg" alt="" />
          </IconButton>
        </DualButtonContainer>
      </ToolbarCluster>

      <ToolbarCluster isEnglish={isEnglish} alignEnglish={69} alignHebrew={31} zIndexLevel={15010}>
        <ToolbarLabel width="8rem" align="center">
          {isEnglish ? 'Hero content' : 'תוכן ראשי'}
        </ToolbarLabel>
        <IconButton
          onClick={onOpenHeroSettings}
          aria-label={isEnglish ? 'Edit hero content' : 'עריכת תוכן ראשי'}
        >
          <IconImage variant="accent" src="/images/backoffice/edit.svg" alt="" />
        </IconButton>
      </ToolbarCluster>
    </>
  );
};

export default HomePageToolbar;
