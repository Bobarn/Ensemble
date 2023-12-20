import { useParams } from 'react-router-dom';
import GroupForm from '../GroupForm/GroupForm';
import { thunkGetSpecificGroup } from '../../store/groups';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const UpdateAGroupPage = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkGetSpecificGroup(groupId));
}, [dispatch]);

const group = useSelector((state) => state.groups[groupId]);

const groupImage = useSelector((state) => state.groups.Groups[groupId])

  if (!group) return(<></>);

  /* **DO NOT CHANGE THE RETURN VALUE** */
  return (
    Object.keys(group).length > 1 && (
      <>
        <GroupForm
          group={{
            name: group?.name,
            location: `${group?.city}, ${group?.state}`,
            about: group?.about,
            type: group?.type,
            private: group?.private === 'true',
            image: groupImage?.previewImage
          }}
          groupId={groupId}
          formType="Update Group"
        />
      </>
    )
  );
};

export default UpdateAGroupPage;
