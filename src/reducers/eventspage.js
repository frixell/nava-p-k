// Events Reducer

const eventsReducerDefaultState = {};

 export default (state = eventsReducerDefaultState, action) => {
    let categoryIndex = 0;
    let subcategoryIndex = 0;
    let eventIndex = 0;
    const events = state;
    switch (action.type) {
        
        case 'SET_CATEGORIES':
            events.categories = action.categories;
            return events;
        case 'SET_SUBCATEGORIES':
            events[action.categoryId] = action.subcategories;
            return events;
        case 'SET_ALL_SUBCATEGORIES':
            events.allSubCategories = action.subcategories;
            return events;
        case 'SET_ITEMS':
            events[action.categoryId+'items'] = action.items;
            return events;
        case 'SET_ALL_EVENTS':
            events.allEvents = action.items;
            return events;
        case 'SET_IMAGES':
            events[action.categoryId+'items'][action.itemLocation].images = action.images;
            return events;
    
        case 'ADD_CATEGORY':
            events.categories = events.categories.push(action.category);
            return events;
        case 'ADD_SUBCATEGORY':
            events[action.categoryId] = action.subcategories;
            return events;
        case 'ADD_ITEM':
            events[action.categoryId+'items'] = action.items;
            return events;
        case 'ADD_IMAGE':
            return events;
        
        case 'EDIT_SEO':
            categoryIndex = 0;
            events.categories.map((category, index) => {
                if(category.id === action.categoryId) {
                    categoryIndex = index;
                }
            });
            events.categories[categoryIndex].seo = action.seo;
            return events;
        case 'EDIT_SUB_SEO':
            categoryIndex = 0;
            events.categories.map((category, index) => {
                if(category.id === action.categoryId) {
                    categoryIndex = index;
                }
            });
            events.categories[categoryIndex].seo = action.seo;
            return events;
        case 'EDIT_EVENT_SEO':
            eventIndex = 0;
            events[action.categoryId+'items'].map((item, index) => {
                if(item.id === action.eventId) {
                    eventIndex = index;
                }
            });
            events[action.categoryId+'items'][categoryIndex].seo = action.seo;
            return events;
        case 'EDIT_CATEGORY':
            categoryIndex = 0;
            events.categories.map((category, index) => {
                if(category.id === action.category.id) {
                    categoryIndex = index;
                }
            });
            events.categories[categoryIndex] = action.category;
            return events;
        case 'EDIT_SUBCATEGORIES':
            events[action.categoryId] = action.subcategories;
            return events;
        case 'EDIT_EVENTS':
            events[action.categoryId+'items'] = action.events;
            return events;
        case 'EDIT_IMAGES':
            events[action.categoryId+'items'].map((event, index) => {
                if (event.id === action.eventId) {
                    events[action.categoryId+'items'][index].images = action.images;                    
                }
            });
            return events;

        case 'SET_CATEGORY_ID':
            events.categoryId = action.id;
            return events;
        case 'SET_SUBCATEGORY_ID':
            events.subcategoryId = action.id;
            return events;

        case 'TOGGLE_SHOW_SUBCATEGORY':
            events[action.categoryId].map((subcategory, index) => {
                if(subcategory.id === action.subcategoryId) {
                    subcategoryIndex = index;
                }
            });
            events[action.categoryId][subcategoryIndex].visible = action.visible;
            return events;
        case 'TOGGLE_ALL_SHOW_SUBCATEGORY':
            events.allSubCategories.map((subcategory, index) => {
                if(subcategory.id === action.subcategoryId) {
                    subcategoryIndex = index;
                }
            });
            events.allSubCategories[subcategoryIndex].visible = action.visible;
            return events;
        case 'TOGGLE_SHOW_EVENT':
            events[action.categoryId+'items'].map((event, index) => {
                if(event.id === action.eventId) {
                    eventIndex = index;
                }
            });
            events[action.categoryId+'items'][eventIndex].visible = action.visible;
            return events;
        case 'TOGGLE_ALL_SHOW_EVENT':
            events.allEvents.map((event, index) => {
                if(event.id === action.eventId) {
                    eventIndex = index;
                }
            });
            events.allEvents[eventIndex].visible = action.visible;
            return events;
        
        
        default:
            return state;
    }
};