import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { thunkGetGroupEvents } from '../../../../../store/events';
import { useNavigate } from 'react-router-dom';

export default function GroupListItem({ group }) {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const events = useSelector((state) => state.events.Events[group?.id]);

    useEffect(() => {
        dispatch(thunkGetGroupEvents(group.id));
    }, [dispatch])

    function onClick() {
        navigate(`/groups/${group.id}`);
    }

    return (
        <li className='GroupItem' onClick={onClick}>
            <div>
                <img src={group.previewImage} alt='Preview image for this group'/>
            </div>
            <div>
                <h2 className='group-name'>{group.name}</h2>
                <h5 className='group-location'>{`${group.city}, ${group.state}`}</h5>
                <p className='group-about-preview'>{group.about.slice(0, 30)}</p>
                <div className='group-details'>
                    <h5># {events?.length} events</h5>
                    <h5>&bull;</h5>
                    <h5>{group.private ? "Private": "Public"}</h5>
                </div>
            </div>
        </li>
    )
}
