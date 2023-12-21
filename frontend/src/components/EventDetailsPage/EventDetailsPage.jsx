import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { thunkGetSpecificEvent } from '../../store/events';
import GroupTile from '../GroupTile/GroupTile';
// import GroupExtrasArea from '../GroupExtrasArea/GroupExtrasArea';
// import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
// import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';


export default function EventDetailsPage() {


    const { eventId } = useParams();

    const dispatch = useDispatch();

    const event = useSelector((state) => state.events.All[eventId]);

    const eventImage = useSelector((state) => state.events.All[eventId]?.previewImage);

    // const group = useSelector((state) => state.groups.Groups[groupId]);


    useEffect(() => {
        dispatch(thunkGetSpecificEvent(eventId));
    }, [dispatch]);
    // const userId = useSelector((state) => state.session.user?.id);

    // function onClickUpdate() {
    //     navigate(`/groups/${groupId}/edit`);
    // }


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
                <img src={eventImage} alt='Preview Image for this event'/>
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
                    </div>
                </div>
                <div>
                    <h2>Details</h2>
                    <p>
                        {event?.description}
                    </p>
                </div>
                 {/*<span>
                     {userId === group?.organizerId &&
                     <div>
                         <button>Create event</button>
                         <button onClick={onClickUpdate}>Update</button>
                         <button>
                         <OpenModalMenuItem
                         itemText="Delete"
                         modalComponent={<DeleteConfirmationModal groupId={groupId} />}
                         />
                         </button>
                     </div>}
                     {userId && userId !== group?.organizerId && <div>
                         <button>Join this group</button>
                     </div>}
                 </span>*/}
             </div>
        </div>
    )
}
