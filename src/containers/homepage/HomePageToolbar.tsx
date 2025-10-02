import React from 'react';

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
    onStartEditCategory
}) => {
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <div
                className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--exit"
                style={isEnglish ? { textAlign: 'center', left: '90%' } : { textAlign: 'center', left: '10%' }}
            >
                <div className="backoffice__toolbar__label">
                    {isEnglish ? 'Exit' : 'יציאה'}
                </div>
                <button className="backoffice_button" onClick={onLogout}>
                    <img className="backoffice_icon" src="/images/backoffice/exit.svg" alt="יציאה" />
                </button>
            </div>

            {hasSelectedProject ? (
                <div
                    className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--save-project"
                    style={isEnglish ? { textAlign: 'center', left: '83%' } : { textAlign: 'center', left: '17%' }}
                >
                    <div className="backoffice__toolbar__label" style={{ textAlign: 'center', color: needSave ? 'red' : 'aqua' }}>
                        {isEnglish ? 'Save' : 'שמירה'}
                    </div>
                    <button className="backoffice_button" onClick={onSave}>
                        <img className="backoffice_icon" src="/images/backoffice/save.svg" alt="שמירה" />
                    </button>
                </div>
            ) : (
                <div
                    className="backoffice__nav__toolbar__buttons backoffice__nav__toolbar__buttons--add-project"
                    style={isEnglish ? { textAlign: 'center', left: '83%' } : { textAlign: 'center', left: '17%' }}
                >
                    <div className="backoffice__toolbar__label" style={{ width: '7rem', textAlign: 'center', color: allowAddPoint ? 'red' : 'aqua' }}>
                        {isEnglish ? 'Add project' : 'הוספת פרוייקט'}
                    </div>
                    <button className="backoffice_button" onClick={onToggleAddPoint}>
                        <img className="backoffice_icon" src="/images/eventspage/add-eventSubcategory-icon.svg" alt="הוספת פרוייקט" />
                    </button>
                </div>
            )}

            <div
                className="backoffice__nav__toolbar__buttons"
                style={isEnglish ? { textAlign: 'center', left: '76%' } : { textAlign: 'center', left: '24%' }}
            >
                <div className="backoffice__toolbar__label" style={isEnglish ? { paddingLeft: '6px', textAlign: 'center' } : { textAlign: 'center' }}>
                    {isEnglish ? 'Manage categories' : 'ניהול קטגוריות'}
                </div>
                <div
                    style={{
                        position: 'relative',
                        width: '7rem',
                        height: '3rem',
                        display: 'inline-block'
                    }}
                >
                    <button className="backoffice__add__button" onClick={onToggleNewCategory}>
                        <img className="backoffice__add__icon" src="/images/eventspage/add-eventSubcategory-icon.svg" alt="הוספת קטגוריה" />
                    </button>
                    <button className="backoffice__edit__button" onClick={onStartEditCategory}>
                        <img className="backoffice__edit__icon" src="/images/backoffice/edit.svg" alt="עריכה" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default HomePageToolbar;
