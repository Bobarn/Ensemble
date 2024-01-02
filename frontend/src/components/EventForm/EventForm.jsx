import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateEvent, thunkCreateEventImage } from '../../store/events';
import './EventForm.css'
import { thunkGetSpecificGroup } from '../../store/groups';

const EventForm = ({ event, formType }) => {
  const navigate = useNavigate();
  const [price, setPrice] = useState(event?.price);
  const [name, setName] = useState(event?.name);
  const [description, setDescription] = useState(event?.description);
  const [privateBoolean, setPrivateBoolean] = useState(event?.private);
  const [type, setType] = useState(event?.type);
  const [image, setImage] = useState(event?.image);
  const [startDate, setStartDate] = useState(event?.startDate);
  const [endDate, setEndDate] = useState(event?.endDate);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false)
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  const { groupId } = useParams();

  const group = useSelector((state) => state.groups[groupId]);

  useEffect(() => {

    dispatch(thunkGetSpecificGroup(groupId));

  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Here are the errors before submitting", errors);

    setDisabled(true);

    setSubmitted(true);

    event = {name, capacity: 100, description, private: privateBoolean, type, venueId: 1, price: Number(price), startDate, endDate };

    if(Object.values(errors).length) {
      event.errors = errors;
    }

    if(formType === 'Create Event' && !event.errors) {

      event = await dispatch(thunkCreateEvent(event, groupId));

      await dispatch(thunkCreateEventImage(event?.id, image))

    }
    // else if(formType === 'Update Event' && !event.errors){

    //   event = await dispatch(thunkUpdateEvent(event, eventId));

    //   await dispatch(thunkCreateEventImage(image, eventId));

    // }
    else {

      setDisabled(false)

      return null;

    }

    if(event.errors) {

      setErrors(event.errors);

      console.log("Here are the errors after submitting", errors);


      setDisabled(false);

    } else {

      navigate(`/events/${event.id}`);

    }
  };

  useEffect(() => {
    const newErrors = {};

    if(!type) {
        newErrors.type = 'Event Type is required';
    }
    if(privateBoolean === '') {
        newErrors.private = 'Visibility is required';
    }
    if(!image?.endsWith('.png') && !image?.endsWith('.PNG') && !image?.endsWith('.jpg') && !image?.endsWith('.JPG') && !image?.endsWith('.jpeg') && !image?.endsWith('.JPEG')) {
        newErrors.image = 'Image URL must end in .png, .jpg, or .jpeg';
    }
    if(description?.length < 30) {
        newErrors.description = 'Description must be at least 30 characters long';
    }
    if(!name) {
        newErrors.name = 'Name is required';
    }
    if(name?.length > 60) {
      newErrors.name = 'Name must be between 60 and 3 characters';
    }
    if(name?.length < 3) {
      newErrors.name = 'Name must be 3 character or'
    }
    if(!price){
        newErrors.price = 'Price is required';
    }
    if(!startDate) {
        newErrors.startDate = 'Event start is required'
    }
    if(new Date(startDate).getTime() < new Date().getTime()) {
      newErrors.startDate = 'Event start must be in the future'
    }
    if(!endDate) {
      newErrors.endDate = 'Event end is required'
    }
    if(new Date(endDate).getTime() <= new Date(startDate).getTime()) {
      newErrors.endDate = 'Event end must be after the start'
    }

    setErrors(newErrors);
  }, [submitted, type, privateBoolean, image, description, name, price, startDate, endDate])

  return (
    <form id='event-form' onSubmit={handleSubmit}>
      <h2>{`Create a new event for ${group?.name}`}</h2>
      <div id='event-name'>
        <h2>What is the name of your event?</h2>
        <label>
            <textarea
            className='event-text'
            placeholder='Event Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </label>
        {submitted && <div className="errors">{errors.name}</div>}
      </div>
      <div id='selectors'>
      <div className={"selector type"}>
            <h5>Is this an in-person or online group?</h5>
            <label>
                <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                >
                    <option value={'In person'}>In person</option>
                    <option value={'Online'}>Online</option>
                    <option value={''} disabled>&#40;select one&#41;</option>
                </select>
            </label>
                  {submitted && <div className="errors">{errors.type}</div>}
        </div>
        <div className={"selector private"}>
            <h5>Is this event private or public?</h5>
            <label>
                <select
                value={privateBoolean}
                onChange={(event) => setPrivateBoolean(event.target.value)}
                placeholder='(select one)'
                >
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                    <option value={''} disabled>&#40;select one&#41;</option>
                </select>
            </label>
            {submitted && <div className="errors">{errors.private}</div>}
        </div>
        <div id=''>
        <h5>What is the price of your event?</h5>
        <div>
        <label>
        <input
        type="number"
        min="0.00"
        step="0.50"
        placeholder='0'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        />
        </label>
        </div>
        {submitted && <div className="errors">{errors.price}</div>}
      </div>
      </div>
      <div id='event-dates'>
        <h5>When does your event start?</h5>
        <label htmlFor="start">
        <input
        type="datetime-local"
        id="start"
        name="startDate"
        placeholder='MM/DD/YYYY, HH/mm PM'
        value={startDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => setStartDate(e.target.value)}
        />
        </label>
        {submitted && <div className="errors">{errors.startDate}</div>}
        <h5>When does your event end?</h5>
        <label htmlFor="end">
        <input
        type="datetime-local"
        id="end"
        name="endDate"
        placeholder="mm/dd/yyyy hh:mm xm"
        value={endDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => setEndDate(e.target.value)}
        />
        </label>
        {submitted && <div className="errors">{errors.endDate}</div>}

      </div>
      <div id='event-image-url'>
        <h5>Please add an image url for your event below:</h5>
        <label>
            <textarea
            className='event-text'
            placeholder='Image URL'
            value={image}
            onChange={(e) => setImage(e.target.value)}
            />
        </label>
            {submitted && <div className="errors">{errors.image}</div>}
      </div>
      <div>
        <h5>Please describe your event:</h5>
        <label>
            <textarea
            id='event-description-area'
            placeholder='Please include at least 30 characters'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </label>
            {submitted && <div className="errors">{errors.description}</div>}
        </div>
      <button disabled={disabled} id='event-form-submit' type="submit">{formType}</button>
    </form>
  );
};

export default EventForm;
