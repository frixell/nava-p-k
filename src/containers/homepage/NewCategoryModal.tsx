// @ts-nocheck
import React from 'react';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import styled from '@emotion/styled';

const ModalWrapper = styled.div({
    textAlign: 'center',
    padding: '2rem 1rem'
});

const Heading = styled.h2({
    margin: '0 0 0.8rem',
    fontFamily: 'Heebo, sans-serif'
});

const SubHeading = styled.h4({
    margin: '0 0 0.4rem',
    fontFamily: 'Heebo, sans-serif'
});

const AlertMessage = styled.h4({
    margin: '0 0 1.6rem',
    color: 'var(--color-error, #d14343)',
    fontFamily: 'Heebo, sans-serif'
});

const FormRow = styled.div({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    direction: 'rtl'
});

const NameInput = styled.input({
    width: '240px',
    height: '3.4rem',
    borderRadius: '6px',
    border: '1px solid rgba(0,0,0,0.2)',
    padding: '0 0.8rem',
    fontSize: '1.6rem'
});

const SubmitButton = styled.button({
    padding: '0.9rem 1.8rem',
    borderRadius: '999px',
    border: 'none',
    background: 'var(--color-accent-alt, #2e7d32)',
    color: 'var(--color-surface, #fff)',
    fontSize: '1.4rem',
    cursor: 'pointer'
});

interface NewCategoryModalProps {
    isOpen: boolean;
    value: string;
    alertMessage?: string;
    onClose: () => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
    isOpen,
    value,
    alertMessage,
    onClose,
    onChange,
    onSubmit
}) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            center
            classNames={{
                overlay: 'custom-overlay',
                modal: 'custom-modal',
                closeButton: 'custom-close-button'
            }}
        >
            <ModalWrapper>
                <Heading className="Heebo-Medium">הוספת קטגוריה חדשה</Heading>
                <SubHeading className="Heebo-Regular">נא למלא שם לקטגוריה החדשה</SubHeading>
                {alertMessage && <AlertMessage className="Heebo-Regular">{alertMessage}</AlertMessage>}
                <FormRow>
                    <NameInput
                        type="text"
                        placeholder="שם הקטגוריה"
                        value={value}
                        onChange={onChange}
                        dir="rtl"
                    />
                    <SubmitButton type="button" onClick={onSubmit}>
                        המשך
                    </SubmitButton>
                </FormRow>
            </ModalWrapper>
        </Modal>
    );
};

export default NewCategoryModal;
