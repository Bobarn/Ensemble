import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { thunkCreateGroup, thunkUpdateGroup } from '../../store/groups';
import { thunkCreateGroupImage } from '../../store/groupImages';

const GroupForm = ({ group, formType, groupId }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(group?.location);
  const [name, setName] = useState(group?.name);
  const [about, setAbout] = useState(group?.about);
  const [privateBoolean, setPrivateBoolean] = useState(group?.private);
  const [type, setType] = useState(group?.type);
  const [image, setImage] = useState(group?.image);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false)
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(true);

    const [city, state] = location.split(', ');

    group = { city, state, name, about, private: privateBoolean, type };
    if(formType === 'Create Group') {
      group = await dispatch(thunkCreateGroup(group));
      await dispatch(thunkCreateGroupImage(image, group?.id))
    } else if(formType === 'Update Group'){
      group = await dispatch(thunkUpdateGroup(group, groupId));
      // console.log(i)
      await dispatch(thunkCreateGroupImage(image, groupId));
    } else {
      return null;
    }
    console.log('Here is the whole group', group);
    if(group.errors) {
        console.log('And here are the errors', group.errors);
      setErrors(group.errors);
    } else {
      navigate(`/groups/${group.id}`);
    }
  };

  useEffect(() => {
    const newErrors = {};

    if(!type) {
        newErrors.type = 'Group Type is required';
    }
    if(privateBoolean === '') {
        newErrors.private = 'Visibility Type is required';
    }
    if((!image?.endsWith('png') || !image?.endsWith('PNG') || !image?.endsWith('jpg') || !image?.endsWith('JPG') || !image?.endsWith('jpeg') || !image?.endsWith('JPEG')) && image) {
        newErrors.image = 'Image URL must end in .png, .jpg, or .jpeg';
    }
    if(about?.length < 30) {
        newErrors.about = 'Description must be at least 30 characters long';
    }
    if(!name) {
        newErrors.name = 'Name is required';
    }
    if(!location || location?.split(', ').length <= 1) {
        newErrors.location = 'Location is required (City, state)';
    }

    setErrors(newErrors);
  }, [submitted, type, privateBoolean, image, about, name, location])

  /* **DO NOT CHANGE THE RETURN VALUE** */
  return (
    <form onSubmit={handleSubmit}>
      <h2>{formType}</h2>
      <div>
        <h2>First, set your group&#39;s location</h2>
        <p>Meetup groups meet locally, in person and online. We&#39;ll connect you with people
in your area, and more can join you online.</p>
        {submitted && <div className="errors">{errors.location}</div>}
        <label>
            <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='City, STATE'
            />
        </label>
      </div>
      <div>
        <h2>What will your group&#39;s name be?</h2>
        <p>Choose a name that will give people a clear idea of what the group is about.
Feel free to get creative! You can edit this later if you change your mind.</p>
        {submitted && <div className="errors">{errors.name}</div>}
        <label>
            <textarea
            placeholder='What is your group name?'
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </label>
      </div>
      <div>
        <h2>Now describe what your group will be about</h2>
        <p>People will see this when we promote your group, but you&#39;ll be able to add to it later, too.</p>
        <ol>
            <li>What&#39;s the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
        </ol>
        {submitted && <div className="errors">{errors.about}</div>}
        <label>
            <textarea
            placeholder='Please write at least 30 characters'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            />
        </label>
        </div>
        <h2>Final steps...</h2>
        <div className={"selector type"}>
           {submitted && <div className="errors">{errors.type}</div>}
            <p>Is this an in person or online group?</p>
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
        </div>
        <div className={"selector private"}>
            {submitted && <div className="errors">{errors.private}</div>}
            <p>Is this group private or public?</p>
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
        </div>
        <div>
        <p>Please add an image url for your group below:</p>
        {submitted && <div className="errors">{errors.image}</div>}
        <label>
            <textarea
            placeholder='What is your group name?'
            value={image}
            onChange={(e) => setImage(e.target.value)}
            />
        </label>
      </div>
      <button type="submit">{formType}</button>
    </form>
  );
};

export default GroupForm;
