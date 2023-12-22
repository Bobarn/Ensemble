import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { thunkGetGroupEvents } from '../../../../../store/events';
import { useNavigate } from 'react-router-dom';
import './GroupsListItem.css'

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
        <div className='group-item' onClick={onClick}>
            <div className='group-img-container'>
                <img className='group-img' src={group.previewImage} alt='Preview image for this group'/>
            </div>
            <div className='group-information'>
                <h2 className='group-name'>{group.name}</h2>
                <h5 className='group-location'>{`${group.city}, ${group.state}`}</h5>
                <p className='group-about-preview'>{group.about}</p>
                <div className='group-description'>
                    <h5># {events?.length} event&#40;s&#41;</h5>
                    <h5>&bull;</h5>
                    <h5>{group.private ? "Private": "Public"}</h5>
                </div>
            </div>
        </div>
    )
}
