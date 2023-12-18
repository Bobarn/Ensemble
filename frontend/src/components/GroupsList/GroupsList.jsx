// import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllGroups } from '../../store/groups';
import { useEffect } from 'react';
import GroupListItem from '../GroupsListItem/GroupsListItem';

export default function GroupsList() {

    const groupsObj = useSelector((state) => state.groups.Groups);

    console.log(groupsObj);

    const groups = Object.values(groupsObj);

    console.log('Here is the selector', groups);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetAllGroups());
    }, [dispatch]);

    return (
        <section>
            <ul>
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
