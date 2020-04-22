import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
//import moment from 'moment';
import { startSendMessage } from '../../actions/messages';

const currentDate = new Date();
//const currentTime = Date.now();
//console.log(currentDate);

export class ContactForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            phone: '',
            email: '',
            message: '',
            createdAt: '',
            error: '',
            mailSentModalIsOpen: false
        }
    }
    onNameChange = (e) => {
        const name = e.target.value;
        this.setState(() => ({ name }));
    };
    onPhoneChange = (e) => {
        const phone = e.target.value;
        this.setState(() => ({ phone }));
    };
    onEmailChange = (e) => {
        const email = e.target.value;
        this.setState(() => ({ email }));
    };
    onMessageChange = (e) => {
        const message = e.target.value;
        this.setState(() => ({ message }));
    };
    onSubmit = (e) => {
        e.preventDefault();
        if (!this.state.name || !this.state.phone || !this.state.email) {
            //set error state to 'Please provide description and amount'
            this.setState(() => ({ error: 'נא למלא שדות חובה (*)' }));
        } else {
            //cleare error message
            this.setState(() => ({ error: '' }));
            this.onSendMail({
                name: this.state.name,
                phone: this.state.phone,
                email: this.state.email,
                message: this.state.message,
                createdAt: currentDate
            });
        }
    };
    onToggleMailSentModal = () => {
        //console.log('toggle');
        this.setState({
            mailSentModalIsOpen: !this.state.mailSentModalIsOpen
        });
        //console.log(this.state.mailSentModalIsOpen);
    }
    onSendMail = (userMessage) => {
        this.props.startSendMessage(userMessage).then((res) => {
            //console.log(res);
            this.onToggleMailSentModal();
        });
    };
    render() {
        const dirLang = this.props.lang === 'he' ? 'rtl' : 'ltr';
        return (
            <div className={`contact__form__box__inputs contact__form__box--${this.props.style}`}>

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
                            <img className="contact__modal__button__image__x" src="/images/eventspage/close.svg" alt="סגירה" />
                        </button> 
                    </div>
                    <img className="contact__confirm__image desktop" src="/images/contact/contact-confirm.svg" alt="שלח" />
                    <img className="contact__confirm__seperator" src="/images/contact/contact-confirm-seperator.png" alt="קו הפרדה" />
                    <h2 className="contact__confirm__header Heebo-Medium" dir={dirLang}>{this.props.lang === 'he' ? 'תודה,' : 'Thank you,'}</h2>
                    <h4 className="contact__confirm__text Heebo-Medium" dir={dirLang}>{this.props.lang === 'he' ? 'אצור עמכם קשר בהקדם' : 'Contact you as soon as possible'}</h4>
                    <img className="contact__confirm__seperator" src="/images/contact/contact-confirm-seperator.png" alt="קו הפרדה" />
                    <h3 className="contact__confirm__footer Heebo-Medium">{this.props.lang === 'he' ? 'נאוה קיינר-פרסוב' : 'Nava Kainer-Persov'}</h3>
                </Modal>

                {this.state.error && <p className={`contact__error--${this.props.style} Heebo-Regular`}>{this.state.error}</p>}
                <form className={this.props.lang === 'he' ? `contact__form--${this.props.style}` : `contact__form--${this.props.style} contact__form__eng--${this.props.style}`} onSubmit={this.onSubmit} dir={dirLang}>
                    <div>
                        <input
                            type="text"
                            placeholder={this.context.t("namePlaceholder")}
                            value={this.state.name}
                            onChange={this.onNameChange}
                        />
                        <input
                            type="text"
                            placeholder={this.context.t("phonePlaceholder")}
                            value={this.state.phone}
                            onChange={this.onPhoneChange}
                        />
                        <input
                            type="email"
                            placeholder={this.context.t("emailPlaceholder")}
                            value={this.state.email}
                            onChange={this.onEmailChange}
                        />
                        <textarea
                            placeholder={this.context.t("messagePlaceholder")}
                            value={this.state.message}
                            onChange={this.onMessageChange}
                        >
                        </textarea>
                        <div>
                            
                            <button hidden={this.props.style==='page'} className="homepage__intouch__button Heebo-Regular desktop">{this.context.t("send")}</button>
                            <button hidden={this.props.style==='page'} className={`contact__button--${this.props.style} mobile`}>{this.context.t("sendMessage")}</button>
                            {
                                this.props.style === "page" ?
                            
                                    <button
                                        className={`contact__imagebutton--${this.props.style} desktop_flex`}
                                        data-name="greenArrow"
                                        onMouseEnter={this.props.setIconRatioOn}
                                        onMouseLeave={this.props.setIconRatioOut}
                                    >
                                        <p className="contact__imagebutton__text Heebo-Regular">{this.context.t("sendMessage")}</p>
                                    </button>
                                    

                                :

                                    null

                            }
                            <button hidden={this.props.style==='strip'} className={`contact__button__mobile--${this.props.style} Heebo-Medium mobile`}>{this.context.t("sendMessage")}</button>
                        </div>
                    </div>
                    
                    
                </form>
            </div>
        )
    }
}

ContactForm.contextTypes = {
  t: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    lang: state.i18nState.lang
});

const mapDispatchToProps = (dispatch) => ({
    startSendMessage: (message) => dispatch(startSendMessage(message))
});

export default connect(undefined, mapDispatchToProps)(ContactForm);