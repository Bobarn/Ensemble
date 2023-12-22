import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { thunkGetSpecificEvent } from '../../store/events';
import GroupTile from '../GroupTile/GroupTile';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteEventConfirmationModal from '../DeleteEventConfirmationModal/DeleteEventConfirmationModal';
import './EventDetailsPage.css';

export default function EventDetailsPage() {


    const { eventId } = useParams();

    const dispatch = useDispatch();

    const event = useSelector((state) => state.events.All[eventId]);

    useEffect(() => {
        dispatch(thunkGetSpecificEvent(eventId));
    }, [dispatch]);
    const userId = useSelector((state) => state.session.user?.id);


    return (
        <div id='events-page'>
             <div id='events-heading'>
                <Link to='/events' className='back-button-events'>Events</Link>
                <h2 className='event-name'>{event?.name}</h2>
                <h5>Hosted by {`${event?.Group?.Organizer?.firstName} ${event?.Group?.Organizer?.lastName}`}</h5>
             </div>
             <div id='event-body-container'>
                <div id='event-display-info'>
                    <div id='event-details-img-container'>
                    <img id='event-details-img' src={event?.EventImages?.find((image) => image.preview === true)?.url} alt='Preview Image for this event'/>
                    </div>
                    <div id='event-details-information'>
                        <div>
                            <GroupTile group={event?.Group}/>
                        </div>
                        <div id='event-details-additional'>
                            <div className='event-additional'>
                                <div id='event-time-icon'><i className="fa-regular fa-clock"></i></div>
                                <div>
                                    <h5>{`${new Date (event?.startDate)}`.slice(0, 21)}</h5>
                                    <h5>{`${new Date (event?.endDate)}`.slice(0, 21)}</h5>
                                </div>
                            </div>
                            <div className='event-additional'><i className="fa-solid fa-dollar-sign"></i> {event?.price}</div>
                            <div className='event-additional'><i className="fa-solid fa-location-dot"></i> {event?.type}</div>
                            <span id='event-organizer-actions-containter'>
                        {userId === event?.Group?.organizerId &&
                        <div id='event-organizer-actions'>
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
