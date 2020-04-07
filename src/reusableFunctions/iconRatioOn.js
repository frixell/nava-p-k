export const iconRatioOn = (e) => {
    switch(e.target.dataset.name) {
        case 'facebook':
            return { 
                ratioFacebook: 1.15,
                ratioInstagram: 1,
                ratioMail: 1,
                ratioPhone: 1
            };
        case 'instagram':
            return {
                ratioFacebook: 1,
                ratioInstagram: 1.15,
                ratioMail: 1,
                ratioPhone: 1
            };
        case 'mail':
            return {
                ratioFacebook: 1,
                ratioInstagram: 1,
                ratioMail: 1.15,
                ratioPhone: 1
            };
        case 'phone':
            return {
                ratioFacebook: 1,
                ratioInstagram: 1,
                ratioMail: 1,
                ratioPhone: 1.15
            };
        case 'greenArrow':
            return {
                ratioGreenArrow: 1.15
            };
        default:
            return null;
    }
}