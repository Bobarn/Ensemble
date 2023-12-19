import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { thunkGetSpecificGroup } from '../../store/groups';


export default function GroupDetailsPage() {

    const { groupId } = useParams();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetSpecificGroup(groupId));
    }, [dispatch]);

    const group = useSelector((state) => state.groups[groupId]);

    const events = useSelector((state) => state.events[group?.id]);

    return (
        <div>

            <div>
                <Link to='/groups' className='back-button'>Groups</Link>
                <img src={group?.previewImage} alt='Preview Image for this group'/>
            </div>
            <div>
                <h2 className='group-name'>{group?.name}</h2>
                <h5 className='group-location'>{`${group?.city}, ${group?.state}`}</h5>
                <div className='group-details'>
                    <h5># {events?.length} events</h5>
                    <h5>&bull;</h5>
                    <h5>{group?.private ? "Private": "Public"}</h5>
                </div>
                <h5>Organized by {`${group?.Organizer.firstName} ${group?.Organizer.lastName}`}</h5>
            </div>
        </div>
    )
}
