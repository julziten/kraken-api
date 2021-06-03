export const updateReducer = (state = {}, action) => {
    switch(action.type) {
        case 'add':
            return {
                ...state,
                snapshot: action.payload
            }
        case 'update':
            return {
                ...state,
                update: action.payload
            }

        default:
            return state;
    }
    
}