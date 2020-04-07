import $ from 'jquery';

export const handleEventsSaveButtonScroll = (backofficeSaveButtonClassName) => {
    if (typeof(window) !== "undefined") {
        const windowShopHeight = $('#shopPage').height();
        const windowShopTop = document.getElementById('shopPage').getBoundingClientRect().top;
        const windowScrollTop = $(window).scrollTop();
        
        console.log(windowShopHeight);

        console.log(windowScrollTop);

        console.log(windowShopTop);
        
        if (180 >= windowShopTop && windowScrollTop - 250 < windowShopHeight && backofficeSaveButtonClassName !== 'backoffice__events__events__buttons__fixed') {
            return { backofficeSaveButtonClassName: 'backoffice__events__events__buttons__fixed' };
        } else if ((180 < windowShopTop || windowScrollTop - 250 > windowShopHeight) && backofficeSaveButtonClassName === 'backoffice__events__events__buttons__fixed') {
            return { backofficeSaveButtonClassName: 'backoffice__events__events__buttons' };
        }
    }
}