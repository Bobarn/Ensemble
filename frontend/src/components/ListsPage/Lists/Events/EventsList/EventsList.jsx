import { useDispatch, useSelector } from 'react-redux';
// import { thunkGetAllEvents, selectEventsArray } from '../../../../store/events';
import { thunkGetAllEvents, selectEventsArray } from '../../../../../store/events';
import { useEffect } from 'react';
import GroupEventsTile from '../GroupEventsTile/GroupEventsTile';
import ListNav from '../../ListNav/ListNav';

export default function EventsList() {

    const events = useSelector(selectEventsArray);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetAllEvents());
    }, [dispatch]);

    return (
        <section>
            <ListNav />
            <h5>Events in Meetup</h5>
            <ul>
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
