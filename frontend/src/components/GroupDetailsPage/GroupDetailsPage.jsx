import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { thunkGetAllGroups, thunkGetSpecificGroup } from '../../store/groups';
import { thunkGetGroupEvents } from '../../store/events';
import GroupExtrasArea from '../GroupExtrasArea/GroupExtrasArea';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';


export default function GroupDetailsPage() {

    const navigate = useNavigate();

    const { groupId } = useParams();

    const dispatch = useDispatch();

    const group = useSelector((state) => state.groups[groupId]);

    if(!group) {
        navigate('/groups');
    }

    const groupImage = useSelector((state) => state.groups.Groups[groupId]?.previewImage);

    const events = useSelector((state) => state.events.Events[group?.id]);

    const userId = useSelector((state) => state.session.user?.id);

    useEffect(() => {
        dispatch(thunkGetSpecificGroup(groupId));
        dispatch(thunkGetGroupEvents(groupId));
        dispatch(thunkGetAllGroups());
    }, [dispatch]);




    return (
        <div>
            <div>
                <Link to='/groups' className='back-button'>Groups</Link>
                <img src={groupImage} alt='Preview Image for this group'/>
            </div>
            <div>
                <div>
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
                    {userId === group?.organizerId ?
                    <div>
                        <button>Create event</button>
                        <button>Update</button>
                        <OpenModalMenuItem
                        itemText="Delete"
                        modalComponent={<DeleteConfirmationModal groupId={groupId} />}
                        />
                    </div>
                    :
                    <div>
                        <button>Join this group</button>
                    </div>}
                </span>
            </div>
            <GroupExtrasArea group={group} events={events}/>
        </div>
    )
}
