export const initialState = null

export const reducer = (state, action) => {
    if (action.type === "USER") {
        return action.payload
    }
    if (action.type === "CLEAR") { //if the logout button will clicked, this will implement, it will simply return the state as null.
        return null
    }
    if (action.type === "UPDATE") { // it is action for following other users, it will update the follwers and following array on every click 
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    if (action.type === "UPDATEPIC") { //when profile pic is updated
        return {
            ...state,
            pic: action.payload
        }
    }
    return state
}