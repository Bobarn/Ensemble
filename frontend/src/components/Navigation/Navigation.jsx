import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);



  return (
    <div id='Navbar'>
        <NavLink className='logo'>Home</NavLink>
        {isLoaded && (
          <div className='profile-area' id={sessionUser ? "logged" : "not-logged"}>
            {sessionUser &&
            <NavLink to={'/groups/new'}>Start a new group</NavLink>
            }
            <ProfileButton user={sessionUser} />

          </div>
        )}
    </div>
  );
}

export default Navigation;
