import React from 'react';
import AutosizeInput from 'react-input-autosize';
import Textarea from 'react-expanding-textarea';

const shouldHighLight = (org, update) => {
    if ( org === update ) {
        return 'edit__bg inline-block';
    } else {
        return 'edit__changed__bg inline-block';
    }
};

const header = 'מספרים עלינו';

class HomePageTell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        height: 'auto',
        minHeight: 100
    };
  }
 
  render() {
      let id = '';
      let name = '';
      let position = '';
      let company = '';
      let createdAt = '';
      let text = '';
      let logo = '';
      let publicid = '';
      if(this.props.tell[this.props.tellIndex]){
            id = this.props.tell[this.props.tellIndex].id;
            name = this.props.tell[this.props.tellIndex].name;
            position = this.props.tell[this.props.tellIndex].position;
            company = this.props.tell[this.props.tellIndex].company;
            createdAt = this.props.tell[this.props.tellIndex].createdAt;
            text = this.props.tell[this.props.tellIndex].text;
            logo = this.props.tell[this.props.tellIndex].logo;
            publicid = this.props.tell[this.props.tellIndex].publicId;
      }
    return (
        <div className="homepage__tell__box">
        {
                this.props.isAuthenticated === true ?
                    <div className="homepage__tell__box__auth">
                        <img className="homepage__tell__image desktop" src="https://res.cloudinary.com/orenpro/image/upload/v1534248940/tell.jpg" alt="אורן ורינת הפקות - מספרים עלינו" />
                        <img className="homepage__tell__image mobile" src="https://res.cloudinary.com/orenpro/image/upload/v1534248940/tell-mobile.jpg" alt="אורן ורינת הפקות - מספרים עלינו" />
                        <h2 className="homepage__tell__header Heebo-Medium">{header}</h2>
                        <div className="homepage__tell__logo__box mobile">
                            <img className="homepage__tell__logo mobile_inline" src={logo} alt="לוגו" />
                        </div>
                        <div className="homepage__tell__body">
                            <div className="homepage__tell__body__text" dir="rtl">
                                <div className="homepage__tell__details__block">
                                    {
                                        this.props.tell[this.props.tellIndex] ?
                                            <div className={shouldHighLight(this.props.tellOrigin[this.props.tellIndex].name, this.props.tell[this.props.tellIndex].name)}>
                                            <AutosizeInput
                                                className="homepage__tell__details Heebo-Medium"
                                                name="name"
                                                data-name="tell"
                                                data-index={id}
                                                data-order={this.props.tellIndex}
                                                data-field='name'
                                                data-action={this.props.action}
                                                placeholder="שם ומשפחה"
                                                value={name}
                                                onChange={this.props.onChange}
                                            />
                                            </div>
                                        :
                                            null
                                    }
                                    <div className="homepage__tell__details homepage__tell__details--coma Heebo-Medium">, </div>
                               </div>
                               <div className="homepage__tell__details__block">
                                    {
                                        this.props.tell[this.props.tellIndex] ?
                                            <div className={shouldHighLight(this.props.tellOrigin[this.props.tellIndex].position, this.props.tell[this.props.tellIndex].position)}>
                                                <AutosizeInput
                                                    className="homepage__tell__details Heebo-Medium"
                                                    name="position"
                                                    data-name="tell"
                                                    data-index={id}
                                                    data-order={this.props.tellIndex}
                                                    data-field='position'
                                                    data-action={this.props.action}
                                                    placeholder="תפקיד"
                                                    value={position}
                                                    onChange={this.props.onChange}
                                                />
                                            </div>
                                        :
                                            null
                                    }
                                </div>
                                <div className="homepage__tell__details__block">
                                    {
                                        this.props.tell[this.props.tellIndex] ?
                                            <div className={shouldHighLight(this.props.tellOrigin[this.props.tellIndex].company, this.props.tell[this.props.tellIndex].company)}>
                                            <AutosizeInput
                                                className="homepage__tell__details Heebo-Medium"
                                                name="company"
                                                data-name="tell"
                                                data-index={id}
                                                data-order={this.props.tellIndex}
                                                data-field='company'
                                                data-action={this.props.action}
                                                placeholder="חברה"
                                                value={company}
                                                onChange={this.props.onChange}
                                            />
                                            </div>
                                        :
                                            null
                                    }
                                    <p className="homepage__tell__details homepage__tell__details--seperator Heebo-Medium"> | </p>
                                    {
                                        this.props.tell[this.props.tellIndex] ?
                                            <div className={shouldHighLight(this.props.tellOrigin[this.props.tellIndex].createdAt, this.props.tell[this.props.tellIndex].createdAt)}>
                                            <AutosizeInput
                                                className="homepage__tell__details Heebo-Medium"
                                                name="createdAt"
                                                data-name="tell"
                                                data-index={id}
                                                data-order={this.props.tellIndex}
                                                data-field='createdAt'
                                                data-action={this.props.action}
                                                placeholder="תאריך"
                                                value={createdAt}
                                                onChange={this.props.onChange}
                                            />
                                            </div>
                                        :
                                            null
                                    }
                                </div>
                                {
                                    this.props.tell[this.props.tellIndex] ?
                                        <div className={shouldHighLight(this.props.tellOrigin[this.props.tellIndex].text, this.props.tell[this.props.tellIndex].text)}>
                                            <textarea
                                                dir="rtl"
                                                data-name="tell"
                                                data-index={id}
                                                data-order={this.props.tellIndex}
                                                data-field='text'
                                                data-action={this.props.action}
                                                placeholder="טקסט המלצה"
                                                value={text}
                                                onChange={this.props.onChange}
                                            >
                                            </textarea>
                                        </div>
                                    :
                                        null
                                }
                            </div>
                            <img className="homepage__tell__logo desktop_inline" src={logo} alt="לוגו" />
                            <button
                                data-name="tell"
                                data-index={id}
                                data-field='logo'
                                data-publicid={publicid}
                                data-action={this.props.action}
                                onClick={this.props.uploadWidget}
                                className="homepage__tell__upload-button"
                            >
                                <img
                                    data-name="tell"
                                    data-index={id}
                                    data-field='logo'
                                    data-action={this.props.action}
                                    data-publicid={publicid}
                                    className="homepage__tell__upload-button__image"
                                    src="/images/common/upload-image.svg"
                                    alt="הוספת תמונה"
                                />
                            </button>
                        </div>
                        <div className="homepage__tell__pagination__box" dir="rtl">
                            {
                                this.props.tell[this.props.tellIndex] ?
                                this.props.tell.map((event,index) => {
                                    return  <button disabled={String(index) === String(this.props.tellIndex)} data-index={index} key={index} className="homepage__tell__pagination__button" onClick={this.props.setTellIndex}>
                                                <img data-index={index} className="homepage__tell__pagination__image desktop" src={`/images/homepage/tell/pagination${ String(index) === String(this.props.tellIndex) ? "_on" : "" }.svg`} alt="אורן ורינת הפקות - מספרים עלינו" />
                                                <img data-index={index} className="homepage__tell__pagination__image mobile" src={`/images/homepage/tell/pagination_mobile${ String(index) === String(this.props.tellIndex) ? "_on" : "" }.svg`} alt="אורן ורינת הפקות - מספרים עלינו" />
                                            </button>
                                })
                                :
                                null
                            }
                            <button className="homepage__tell__edit__button" onClick={this.props.startEditTell}>
                                <img className="homepage__tell__add" src="/images/backoffice/edit_white.svg" alt="עריכה" />
                            </button>
                            <button className="homepage__tell__add__button" onClick={this.props.addNewTell}>
                                <img className="homepage__tell__add" src="/images/homepage/tell/add-circle-twotone-white-icon.svg" alt="הוספה" />
                            </button>
                        </div>
                    </div>
                :
                    <div>
                        <img className="homepage__tell__image desktop" src="https://res.cloudinary.com/orenpro/image/upload/v1536952256/tell.jpg" alt="אורן ורינת הפקות אירועים - מספרים עלינו" />
                        <img className="homepage__tell__image mobile" src="https://res.cloudinary.com/orenpro/image/upload/v1536952408/tell-mobile.jpg" alt="אורן ורינת הפקות אירועים - מספרים עלינו" />
                        <h2 className="homepage__tell__header Heebo-Medium">{header}</h2>
                        <div className="homepage__tell__logo__box mobile_inline">
                            <img className="homepage__tell__logo mobile_inline" src={logo} alt="לוגו" />
                        </div>
                        <div className="homepage__tell__body">
                            <div className="homepage__tell__body__text" dir="rtl">
                                <p className="homepage__tell__details homepage__tell__details__block homepage__tell__details__block__noedit Heebo-Medium" dir="rtl">{name}, </p>
                                <p className="homepage__tell__details homepage__tell__details__block homepage__tell__details__block__noedit Heebo-Medium" dir="rtl">{position} </p>
                                <p className="homepage__tell__details homepage__tell__details__block homepage__tell__details__block__noedit Heebo-Medium" dir="rtl">{company} | {createdAt} </p>
                                <textarea
                                    dir="rtl"
                                    readOnly
                                    value={text}
                                >
                                </textarea>
                            </div>
                            <img className="homepage__tell__logo desktop_inline" src={logo} alt="לוגו" />
                        </div>
                        <div className="homepage__tell__pagination__box" dir="rtl">
                            {
                                this.props.tell[this.props.tellIndex] ?
                                this.props.tell.map((event,index) => {
                                    return  <button disabled={String(index) === String(this.props.tellIndex)} data-index={index} key={index} className="homepage__tell__pagination__button" onClick={this.props.setTellIndex}>
                                                <img data-index={index} className="homepage__tell__pagination__image desktop" src={`/images/homepage/tell/pagination${ String(index) === String(this.props.tellIndex) ? "_on" : "" }.svg`} alt="אורן ורינת הפקות - מספרים עלינו" />
                                                <img data-index={index} className="homepage__tell__pagination__image mobile" src={`/images/homepage/tell/pagination_mobile${ String(index) === String(this.props.tellIndex) ? "_on" : "" }.svg`} alt="אורן ורינת הפקות - מספרים עלינו" />
                                            </button>
                                })
                                :
                                null
                            }
                        </div>
                    </div>
        }
            
        </div>
    );
  }
}

export default HomePageTell;