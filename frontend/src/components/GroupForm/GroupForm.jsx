import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { thunkCreateGroup, thunkUpdateGroup } from '../../store/groups';
import { thunkCreateGroupImage } from '../../store/groupImages';
import './GroupForm.css'

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
  const [disabled, setDisabled] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setDisabled(true);

    setSubmitted(true);

    const [city, state] = location.split(', ');

    group = { city, state, name, about, private: privateBoolean, type };

    if(Object.values(errors).length) {
      group.errors = errors;
    }

    if(formType === 'Create Group' && !group.errors) {

      group = await dispatch(thunkCreateGroup(group));

      await dispatch(thunkCreateGroupImage(image, group?.id))

    } else if(formType === 'Update Group' && !group.errors){

      group = await dispatch(thunkUpdateGroup(group, groupId));

      await dispatch(thunkCreateGroupImage(image, groupId));

    } else {
      setDisabled(false)

      return null;

    }

    if(group.errors) {

      setErrors(group.errors);

      setDisabled(false);

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
    if((!image?.endsWith('.png') && !image?.endsWith('.PNG') && !image?.endsWith('.jpg') && !image?.endsWith('.JPG') && !image?.endsWith('.jpeg') && !image?.endsWith('.JPEG')) && image) {
        newErrors.image = 'Image URL must end in .png, .jpg, or .jpeg';
    }
    if(about?.length < 50) {
        newErrors.about = 'Description must be at least 50 characters long';
    }
    if(!name) {
        newErrors.name = 'Name is required';
    }
    if(!location || location?.split(', ').length <= 1) {
        newErrors.location = 'Location is required (City, state)';
    }

    setErrors(newErrors);
  }, [submitted, type, privateBoolean, image, about, name, location])

  return (
    <form id='group-form' onSubmit={handleSubmit}>
      <div id='group-form-headings'>
        <h5>BECOME AN ORGANIZER</h5>
        <h2>We&#39;ll walk you through a few steps to build your local community</h2>
      </div>

      <div id='group-form-input-area'>
        <div className={`group-form-input `}>
          <div className={`group-form-restraint`}>
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
        </div>

        <div className={`group-form-input `}>
          <div className={`group-form-restraint`}>
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
        </div>

        <div className={`group-form-input `}>
          <div className={`group-form-restraint`}>
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
                placeholder='Please write at least 50 characters'
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                />
            </label>
            </div>
          </div>

          <div className={`group-form-input `}>
            <div className={`group-form-restraint`}>
              <h2>Final steps...</h2>
              <div className={"selector type"}>
                {submitted && <div className="errors">{errors.type}</div>}
                  <h5>Is this an in person or online group?</h5>
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
                  <h5>Is this group private or public?</h5>
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
              <h5>Please add an image url for your group below:</h5>
              {submitted && <div className="errors">{errors.image}</div>}
              <label>
                  <textarea
                  placeholder='Image URL'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  />
              </label>
            </div>
          </div>
        </div>

        <button disabled={disabled} id='group-form-submit' type="submit">{formType}</button>
      </div>
    </form>
  );
};

export default GroupForm;
