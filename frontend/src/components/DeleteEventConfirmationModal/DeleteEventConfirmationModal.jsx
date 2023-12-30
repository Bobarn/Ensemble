import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal.jsx';
import { thunkDeleteEvent } from '../../store/events.js';

import './DeleteEventConfirmationModal.css';

function DeleteEventConfirmationModal( { event } ) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const handleSubmit = () => {
    closeModal()

    dispatch(thunkDeleteEvent(event?.id))
      .then(navigate(`/groups/${event?.groupId}`))
  };

  const handleCancel = () => {

    return closeModal();
  }

  return (
    <div id='delete-event-modal'>
      <h1>Confirm Delete</h1>
      <h3>Are you sure you want to remove this event?</h3>
      <button className='delete-button' onClick={handleSubmit}>Yes &#40;Delete Event&#41;</button>
      <button className='keep-button' onClick={handleCancel}>No &#40;Keep Event&#41;</button>
    </div>
  );
}

export default DeleteEventConfirmationModal;
