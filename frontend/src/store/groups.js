
//Action type variables area
const GET_ALL_GROUPS = 'groups/GET_ALL_GROUPS';

const GET_GROUPS_BY_USER = 'groups/GET_GROUPS_BY_USER';

const GET_GROUP_BY_ID = 'groups/GET_GROUP_BY_ID';

//action creator area

const getAllGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups
    }
}

const getUserGroups = (groups) => {
    return {
        type: GET_GROUPS_BY_USER,
        groups
    }
}

const getSpecificGroup = (group) => {
    return {
        type: GET_GROUP_BY_ID,
        group
    }
}

//thunk action creator area

export const thunkGetAllGroups = () => async (dispatch) => {
    const response = await fetch('/api/groups');

    if(response.ok) {

        const groups = await response.json();

        dispatch(getAllGroups(groups));

        return groups;
    } else {
        const errors = await response.json();

        return errors;
    }
}

export const thunkGetUserGroups = () => async (dispatch) => {

    const response = await fetch('/api/groups');

    if(response.ok) {

        const groups = await response.json();

        dispatch(getUserGroups(groups));

        return groups;
    } else {
        const errors = await response.json();

        return errors;
    }

}

export const thunkGetSpecificGroup = (groupId) => async (dispatch) => {

    const response = await fetch(`/api/groups/${groupId}`);

    if(response.ok) {

        const group = await response.json();

        dispatch(getUserGroups(group));

        return group;
    } else {
        const errors = await response.json();

        return errors;
    }
}

//selectors area

//reducer and state area
const initialState = { Groups: {} }

export default function groupsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newState = {Groups: {...action.groups}};

            action.groups.forEach((group) => {
                newState.Groups[group.id] = group;
            })

            return newState;

        }
        case GET_GROUPS_BY_USER: {
            const newState = {...state, Groups: {...state.Groups, User: {...action.groups}}};

            return newState;
        }
        case GET_GROUP_BY_ID: {
            const newState = {...state};

            newState.Groups[group.id] = group;

            return newState;
        }
        default:
        return state;
    }
}
