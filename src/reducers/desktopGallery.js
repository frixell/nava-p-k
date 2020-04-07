// Desktop Gallery Reducer

const desktopGalleryReducerDefaultState = {};

 export default (state = desktopGalleryReducerDefaultState, action) => {
    const events = state;
    switch (action.type) {   
        case 'SET_DESKTOP_GALLERY':
            events.desktopGallery = action.desktopImages.map((image) => image);
            //console.log(events.desktopGallery);
            return events;
        default:
            return state;
    }
};