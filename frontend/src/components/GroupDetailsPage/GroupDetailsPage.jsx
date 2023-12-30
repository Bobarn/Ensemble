import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { thunkGetAllGroups, thunkGetSpecificGroup } from '../../store/groups';
import { thunkGetGroupEvents } from '../../store/events';
import GroupExtrasArea from '../GroupExtrasArea/GroupExtrasArea';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteGroupConfirmationModal from '../DeleteGroupConfirmationModal/DeleteGroupConfirmationModal';
import './GroupDetailsPage.css';


export default function GroupDetailsPage() {

    const navigate = useNavigate();

    const { groupId } = useParams();

    const dispatch = useDispatch();

    const group = useSelector((state) => state.groups[groupId]);

    const groupImage = useSelector((state) => state.groups.Groups[groupId]?.previewImage);

    const events = useSelector((state) => state.events.Events[group?.id]);

    const userId = useSelector((state) => state.session.user?.id);

    useEffect(() => {
        dispatch(thunkGetSpecificGroup(groupId));
        dispatch(thunkGetGroupEvents(groupId));
        dispatch(thunkGetAllGroups());
    }, [dispatch]);

    function onClickUpdate() {
        navigate(`/groups/${groupId}/edit`);
    }

    function onClickCreateEvent() {
        navigate(`/groups/${groupId}/events/new`);
    }

    return (
        <div id='group-details-main'>
                    <Link to='/groups' className='back-button'> <i className="fa-solid fa-angle-left"></i>Groups</Link>
            <div id='group-details-body'>
                <div id='group-details-img-container'>
                    <img id='group-details-img' src={groupImage} alt='Preview Image for this group'/>
                </div>
                <div id='group-details-information'>
                    <div className='group-information'>
                        <h2 className='group-name'>{group?.name}</h2>
                        <h5 className='group-location'>{`${group?.city}, ${group?.state}`}</h5>
                        <div className='group-details'>
                            <h5># {events?.length} events</h5>
                            <h5>&bull;</h5>
                            <h5>{group?.private ? "Private": "Public"}</h5>
                        </div>
                        <h5>Organized by {`${group?.Organizer?.firstName} ${group?.Organizer?.lastName}`}</h5>
                    </div>
                    <span>
                        {userId === group?.organizerId &&
                        <div className='organizer-actions'>
                            <button onClick={onClickCreateEvent}>Create event</button>
                            <button onClick={onClickUpdate}>Update</button>
                            <OpenModalMenuItem
                            itemText="Delete"
                            modalComponent={<DeleteGroupConfirmationModal groupId={groupId} />}
                            />
                        </div>}
                        {userId && userId !== group?.organizerId && <div className='join-button-soon-div'>
                            <button className='join-button-soon' onClick={() => alert('Feature coming soon')}>Join this group</button>
                        </div>}
                    </span>
                </div>
            </div>
            <GroupExtrasArea group={group} events={events}/>
        </div>
    )
}
