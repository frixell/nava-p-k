import React from 'react';

const pageToTop = () => {
    if (typeof(window) !== "undefined") {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}

const PageUpStrip = (props) => (
    <div className="pageup__box desktop">
        <div className="pageup__image__hover" />
        <div
            id="pageup__image"
            className={props.pageupImageClassName}
            style={props.pageupImageStyle}
            onClick={pageToTop}
        />
    </div>
);

export default PageUpStrip;