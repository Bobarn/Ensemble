import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_ALL_EVENTS = 'events/GET_ALL_EVENTS';

const GET_GROUP_EVENTS = 'events/GET_GROUP_EVENTS';

const GET_SPECIFIC_EVENT = 'events/GET_SPECIFIC_EVENT';

const getAllEvents = (events) => {
    return {
        type: GET_ALL_EVENTS,
        events
    }
}

const getGroupEvents = (groupId, events) => {
    return {
        type: GET_GROUP_EVENTS,
        groupId,
        events
    }
}

const getSpecificEvent = (event) => {
    return {
        type: GET_SPECIFIC_EVENT,
        event
    }
}

export const thunkGetAllEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events');

    if(response.ok) {
        const events = await response.json();

        dispatch(getAllEvents(events.Events));

        return events.Events;
    } else {
        const errors = await response.json();

        return errors;
    }
}

export const thunkGetGroupEvents = (groupId) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${groupId}/events`);

    if(response.ok) {
        const events = await response.json();

        dispatch(getGroupEvents(groupId, events.Events));

        return events.Events;
    } else {
        const errors = await response.json();

        return errors;
    }
}

export const thunkGetSpecificEvent = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`);

    if(response.ok) {
        const event = await response.json();

        const groupId = event.groupId;

        const data = await csrfFetch(`/api/groups/${groupId}`)

        const group = await data.json();

        event.Group = group;

        dispatch(getSpecificEvent(event));

        return event;
    } else {
        const errors = await response.json();

        return errors;
    }
}

const selectEvents = (state) => {
    return state.events.All;
}

export const selectEventsArray = createSelector(selectEvents, (events) => {
    return Object.values(events);
})


const initialState = { Past: {}, Upcoming: {},  Events: {}, All: {} };

export default function eventsReducer(state = {...initialState}, action ) {
    switch(action.type) {
        case GET_ALL_EVENTS: {
            const newState = { Past: {...state.Past}, Upcoming: {...state.Upcoming}, Events: {...state.Events}, All: {...state.All}}

            action.events.forEach((event) => {
                newState.All[event.id] = event;
            })

            return newState;
        }
        case GET_GROUP_EVENTS: {
            const newState = { Past: {...state.Past}, Upcoming: {...state.Upcoming}, Events: {...state.Events}, All: {...state.All}}

            if(action.events.length) {
                newState.Events[action.groupId] = action.events;
            } else {
                newState.Events[action.groupId] = [];
            }

            newState.Upcoming[action.groupId] = [];

            newState.Past[action.groupId] = [];

            const events = action.events.sort((a, b) => {
               const aTime =  new Date(a.startDate).getTime();

               const bTime = new Date(b.startDate).getTime();

               if(aTime < bTime) {

                return -1;

               } else if(aTime > bTime) {

                return 1

               } else {

                   return 0;

               }

            })

            events.forEach((event) => {
                const today = new Date().getTime();

                const start = new Date(event.startDate).getTime();

                today > start ? newState.Past[action.groupId].push(event) : newState.Upcoming[action.groupId].push(event);
            })

            return newState;
        }
        case GET_SPECIFIC_EVENT: {
            const newState = { Past: {...state.Past}, Upcoming: {...state.Upcoming}, Events: {...state.Events}, All: {...state.All}}

            newState.All[action.event.id] = action.event;

            return newState;
        }
        default: {
            return state;
        }
    }
}
