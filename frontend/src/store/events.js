import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_ALL_EVENTS = 'events/GET_ALL_EVENTS';

const GET_GROUP_EVENTS = 'events/GET_GROUP_EVENTS';

const GET_SPECIFIC_EVENT = 'events/GET_SPECIFIC_EVENT';

const CREATE_EVENT = 'events/CREATE_EVENT';

const DELETE_EVENT = 'events/DELETE_EVENT';

const CREATE_EVENT_IMAGE = 'events/CREATE_EVENT_IMAGE';

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

const createEvent = (event) => {
    return {
        type: CREATE_EVENT,
        event
    }
}

const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId
    }
}

const createEventImage = (eventId, image) => {
    return {
        type: CREATE_EVENT_IMAGE,
        eventId,
        image
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

export const thunkCreateEvent = (event, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(event)
    });

    console.log(response, "Here's the response")

    if(response.ok) {

        const event = await response.json();

        const groupId = event.groupId;

        const data = await csrfFetch(`/api/groups/${groupId}`)

        const group = await data.json();

        event.Group = group;


        dispatch(createEvent(event));

        return event;
    } else {
        const errors = await response.json();

        return errors;
    }


}

export const thunkCreateEventImage = (eventId, image) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            url: image,
            preview: true
        })
    });

    if(response.ok) {
        const image = await response.json();

        dispatch(createEventImage(eventId, image));

        return image
    } else {
        const errors = await response.json();

        return errors;
    }
}

export const thunkDeleteEvent = (eventId) => async (dispatch) => {

    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'}
    });

    if(response.ok) {

        dispatch(deleteEvent(eventId));

    } else {

        const errors = await response.json();

        console.log(errors);

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

                return 1;

               } else if(aTime > bTime) {

                return -1

               } else {

                   return 0;

               }

            })

            console.log(events);

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
        case CREATE_EVENT: {
            const newState = { Past: {...state.Past}, Upcoming: {...state.Upcoming}, Events: {...state.Events}, All: {...state.All}};

            newState.All[action.event.id] = action.event;

            return newState;
        }
        case DELETE_EVENT: {
            const newState = { Past: {...state.Past}, Upcoming: {...state.Upcoming}, Events: {...state.Events}, All: {...state.All}};

            delete newState.All[action.eventId];

            delete newState.Past[action.eventId];

            delete newState.Upcoming[action.eventId]

            return newState;
        }
        case CREATE_EVENT_IMAGE: {
            const newState = { Past: {...state.Past}, Upcoming: {...state.Upcoming}, Events: {...state.Events}, All: {...state.All}};

            return newState;

        }
        default: {
            return state;
        }
    }
}
