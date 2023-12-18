
//Action type variables area
const GET_ALL_GROUPS = 'groups/GET_ALL_GROUPS';

const GET_GROUPS_BY_USER = 'groups/GET_GROUPS_BY_USER';

const GET_GROUP_BY_ID = 'groups/GET_GROUP_BY_ID';

//*Used in both update and create
const CREATE_GROUP = 'groups/CREATE_GROUP';

const DELETE_GROUP = 'groups/DELETE_GROUP';

//action creator area

//!GET ACTIONS
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

//! CREATE ACTIONS
//*Used in both create and update
const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group
    }
}

//! DELETE ACTIONS
const deleteGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId
    }
}

//thunk action creator area

//? GET THUNKS
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

    const response = await fetch('/api/groups/current');

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

        dispatch(getSpecificGroup(group));

        return group;
    } else {
        const errors = await response.json();

        return errors;
    }
}

//? CREATE THUNK

export const thunkCreateGroup = (group) => async (dispatch) => {

    const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(group)
    });

    if(response.ok) {
        const newGroup = await response.json();

        dispatch(createGroup(newGroup));

        return newGroup;
    } else {
        const errors = await response.json();

        return errors;
    }
}

//? UPDATE THUNK
export const thunkUpdateGroup = (group) => async (dispatch) => {

    const response = await fetch(`/api/groups/${group.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(group)
    });

    if(response.ok) {
        const newGroup = await response.json();

        dispatch(createGroup(newGroup));

        return updatedGroup;
    } else {
        const errors = await response.json();

        return errors;
    }
}

//? DELETE THUNK

export const thunkDeleteGroup = (groupId) => async (dispatch) => {

    const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    });

    if(response.ok) {

        dispatch(deleteGroup(groupId));

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
            const newState = {...state, Groups: {...state.Groups}};

            newState.Groups[action.group.id] = action.group;

            return newState;
        }
        case CREATE_GROUP: {
            const newState = {...state, Groups: {...state.Groups}};

            newState.Groups[action.group.id] = action.group;

            return newState;
        }
        case DELETE_GROUP: {
            const newState = {...state, Groups: {...state.Groups}};

            delete newState.Groups[action.groupId];

            return newState;
        }
        default:
            return state;
    }
}
