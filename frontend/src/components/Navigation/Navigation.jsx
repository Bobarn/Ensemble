import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);



  return (
    <div id='Navbar'>
        <NavLink className='logo'><img id='ensemble-logo' alt='Ensemble Logo' src='https://cdn.discordapp.com/attachments/1187515837817557065/1187871344793243739/Screenshot_2023-12-22_133621.png?ex=65987666&is=65860166&hm=50e8aad8e19072bbc26e85266fd973868b9dd2761be2dabd8c9eb15661637640&'/></NavLink>
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
