import { useDispatch, useSelector } from 'react-redux';
// import { thunkGetAllEvents, selectEventsArray } from '../../../../store/events';
import { thunkGetAllEvents, selectEventsArray } from '../../../../../store/events';
import { useEffect } from 'react';
import GroupEventsTile from '../GroupEventsTile/GroupEventsTile';
import ListNav from '../../ListNav/ListNav';
import './EventsList.css'

export default function EventsList() {

    const events = useSelector(selectEventsArray);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetAllEvents());
    }, [dispatch]);

    return (
        <section id='events-list-section'>
            <ListNav />
            <h5 id='events-category-head'>Events in Meetup</h5>
            <ul id='events-list'>
                {events.map((event) => (
                    <GroupEventsTile
                        event={event}
                        key={event.id}
                    />
                ))}
            </ul>
        </section>
    )
}
