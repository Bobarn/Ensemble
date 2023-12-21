import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { thunkGetSpecificEvent } from '../../store/events';
import GroupTile from '../GroupTile/GroupTile';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteEventConfirmationModal from '../DeleteEventConfirmationModal/DeleteEventConfirmationModal';

export default function EventDetailsPage() {


    const { eventId } = useParams();

    const dispatch = useDispatch();

    const event = useSelector((state) => state.events.All[eventId]);

    useEffect(() => {
        dispatch(thunkGetSpecificEvent(eventId));
    }, [dispatch]);
    const userId = useSelector((state) => state.session.user?.id);


    return (
        <div>
            This is the Events page
             <div>
                <Link to='/events' className='back-button'>Events</Link>
                <h2 className='group-name'>{event?.name}</h2>
                <h5>Hosted by {`${event?.Group?.Organizer?.firstName} ${event?.Group?.Organizer?.lastName}`}</h5>
             </div>
             <div>
                <div>
                <img src={event?.EventImages?.find((image) => image.preview === true)?.url} alt='Preview Image for this event'/>
                </div>
                <div>
                    <div>
                        <GroupTile group={event?.Group}/>
                    </div>
                    <div>
                        <div>
                            <i className="fa-regular fa-clock"></i>
                            <h5>{`${new Date (event?.startDate)}`.slice(0, 21)}</h5>
                            <h5>{`${new Date (event?.endDate)}`.slice(0, 21)}</h5>
                        </div>
                        <div><i className="fa-solid fa-dollar-sign"></i></div>
                        <div><i className="fa-solid fa-location-dot"></i></div>
                        <span>
                     {userId === event?.Group?.organizerId &&
                     <div>
                         <button onClick={() => alert('Functionality coming soon')}>Update</button>
                         <OpenModalMenuItem
                         itemText="Delete"
                         modalComponent={<DeleteEventConfirmationModal eventId={eventId} />}
                         />
                     </div>}
                     {userId && userId !== event?.Group?.organizerId && <div>
                         <button onClick={() => alert('Functionality coming soon~!')}>Attend</button>
                     </div>}
                 </span>
                    </div>
                </div>
                <div>
                    <h2>Details</h2>
                    <p>
                        {event?.description}
                    </p>
                </div>
             </div>
        </div>
    )
}
