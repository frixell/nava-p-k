export const iconRatioOut = (e) => {
        switch(e.target.dataset.name) {
            case 'facebook':
                return { 
                    ratioFacebook: 1
                };
            case 'instagram':
                return { 
                    ratioInstagram: 1
                };
            case 'mail':
                return { 
                    ratioMail: 1
                };
            case 'phone':
                return { 
                    ratioPhone: 1
                };
            case 'greenArrow':
                return {
                    ratioGreenArrow: 1
                };
            default:
                return null;
        }
    }