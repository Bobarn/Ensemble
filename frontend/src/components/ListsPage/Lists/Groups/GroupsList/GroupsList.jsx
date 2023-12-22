import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllGroups, selectGroupsArray } from '../../../../../store/groups';
import { useEffect } from 'react';
import GroupListItem from '../GroupsListItem/GroupsListItem';
import ListNav from '../../ListNav/ListNav';
import './GroupsList.css'

export default function GroupsList() {

    const groups = useSelector(selectGroupsArray);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetAllGroups());
    }, [dispatch]);

    return (
        <section id='groups-list-section'>
            <ListNav />
            <h5 id='groups-category-head'>Groups in Meetup</h5>
            <ul id='groups-list'>
                {groups.map((group) => (
                    <GroupListItem
                        group={group}
                        key={group.id}
                    />
                ))}
            </ul>
        </section>
    )
}
