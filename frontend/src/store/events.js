
const GET_GROUP_EVENTS = 'groups/GET_GROUP_EVENTS';

const getGroupEvents = (groupId, events) => {
    return {
        type: GET_GROUP_EVENTS,
        groupId,
        events
    }
}

export const thunkGetGroupEvents = (groupId) => async (dispatch) => {

    const response = await fetch(`/api/groups/${groupId}/events`);

    if(response.ok) {
        const events = await response.json();

        dispatch(getGroupEvents(groupId, events.Events));

        return events.Events;
    } else {
        const errors = await response.json();

        return errors;
    }
}

const initialState = { Past: {}, Upcoming: {},  Events: {} };

export default function eventsReducer(state = {...initialState}, action ) {
    switch(action.type) {
        case GET_GROUP_EVENTS: {
            const newState = {...state, Events: {...state.Events}};

            if(action.events.length) {
                newState.Events[action.groupId] = action.events;
            } else {
                newState.Events[action.groupId] = [];
            }

            newState.Upcoming[action.groupId] = [];

            newState.Past[action.groupId] = [];

            action.events.forEach((event) => {
                const today = new Date().getTime();

                const start = new Date(event.startDate).getTime();

                today > start ? newState.Past[action.groupId].push(event) : newState.Upcoming[action.groupId].push(event);
            })

            return newState;
        }
        default: {
            return state;
        }
    }
}
