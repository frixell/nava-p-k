import React from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class HomePageIntouchForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            error: '',
            mailSentModalIsOpen: false
        }
    }
    onNameChange = (e) => {
        const name = e.target.value;
        this.setState(() => ({ name }));
    };
    onEmailChange = (e) => {
        const email = e.target.value;
        this.setState(() => ({ email }));
    };
    onToggleMailSentModal = () => {
        this.setState({
            mailSentModalIsOpen: !this.state.mailSentModalIsOpen
        });
    }
    
    onSubmit = (e) => {
        e.preventDefault();
        if (!this.state.name || !this.state.email) {
            //set error state to 'Please provide description and amount'
            this.setState(() => ({ error: 'נא למלא שם ודוא״ל' }));
        } else {
            //cleare error message
            this.setState(() => ({ error: '' }));
            //console.log('submitted');
            this.props.onSubmit({
                name: this.state.name,
                email: this.state.email
            });
        }
        this.onToggleMailSentModal();
    };
    render() {
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (
            <div className="homepage__intouch__form__box">
                <Modal
                    open={this.state.mailSentModalIsOpen}
                    onClose={this.onToggleMailSentModal}
                    center
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'contact__modal__container',
                        closeButton: 'contact__modal__close__button'                     
                    }}
                >
                    <div className="events__eventshare__button__box">
                        <button 
                            type='button'
                            className="events__eventshare__button"
                            data-name="greenArrow"
                            onClick={this.onToggleMailSentModal}
                        >
                            X
                        </button> 
                    </div>
                    <h4 className="contact__confirm__text Heebo-Medium" dir="rtl">ההרשמה לניוזלטר עברה בהצלחה!</h4>
                    <h3 className="contact__confirm__footer Heebo-Medium">זיוה קיינר</h3>
                </Modal>

                {this.state.error && <p>{this.state.error}</p>}
                <form className={this.props.lang === 'he' ? `homepage__intouch__form` : `homepage__intouch__form homepage__intouch__form__eng`} onSubmit={this.onSubmit} dir={dirLang}>
                    <input
                        type="text"
                        name="firstname"
                        id="given-name"
                        placeholder={this.context.t("namePlaceholder")}
                        value={this.state.name}
                        onChange={this.onNameChange}
                    />
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={this.context.t("emailPlaceholder")}
                        value={this.state.email}
                        onChange={this.onEmailChange}
                    />
                    
                    <input type="hidden" name="apikey" value="f6c20ab2-9ce5-403b-aeb3-b05c1f6b0af2" />
                    <input type="hidden" name="successredirect" value="http://www.google.com" />
                    <input type="hidden" name="failedredirect" value="http://www.google.com" />
                    <input type="hidden" name="viplists" id="viplists" value="0" />		
                    <input type="hidden" name="exists" id="exists" value="merge" />
                    <input type="hidden" name="restore" id="restore" value="restoreondeleted" />
                    
                    <button className="homepage__intouch__button Heebo-Regular">{this.context.t("send")}</button>
                </form>
            </div>
        )
    }
}

HomePageIntouchForm.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

export default connect(mapStateToProps)(HomePageIntouchForm);