// Mobile Gallery Reducer

const mobileGalleryReducerDefaultState = {};

 export default (state = mobileGalleryReducerDefaultState, action) => {
    const events = state;
    switch (action.type) {   
        case 'SET_MOBILE_GALLERY':
            events.mobileGallery = action.mobileImages.map((image) => image);
            //console.log(events.mobileGallery);
            return events;
        default:
            return state;
    }
};