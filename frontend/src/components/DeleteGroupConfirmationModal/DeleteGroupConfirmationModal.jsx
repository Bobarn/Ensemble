import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal.jsx';
import { thunkDeleteGroup } from '../../store/groups.js';

import './DeleteGroupConfirmationModal.css';

function DeleteGroupConfirmationModal( { groupId } ) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const handleSubmit = () => {
    closeModal();

    dispatch(thunkDeleteGroup(groupId))
      .then(navigate('/groups'))
  };

  const handleCancel = () => {

    return closeModal();
  }

  return (
    <>
      <h1>Confirm Delete</h1>
      <h3>Are you sure you want to remove this group?</h3>
      <button onClick={handleSubmit}>Yes &#40;Delete Group&#41;</button>
      <button onClick={handleCancel}>No &#40;Keep Group&#41;</button>
    </>
  );
}

export default DeleteGroupConfirmationModal;
