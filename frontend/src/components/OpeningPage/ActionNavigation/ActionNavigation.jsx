import { NavLink } from "react-router-dom";
import './ActionNavigation.css';
import { useModal } from "../../../context/Modal";
import { useSelector } from "react-redux";
import SignupFormModal from "../../SignupFormModal/SignupFormModal";

export default function ActionNavigation() {

    const sessionUser = useSelector(state => state.session.user);

    return (
        <div id="action-navigation">
            <div id="meetup-instructions">
                <h3>How Meetup works</h3>
                <p>Placement text about the functionality of meetup and how it can help anyone looking for a community.</p>
            </div>
            <div id="action-row">
                <div className="action-holder">
                    <img className='action-img' src="https://cdn.discordapp.com/attachments/421153749315092489/1187504684655718470/Pngtreecartoon_character_happy_group_of_6728410.png?ex=659720eb&is=6584abeb&hm=85cf0fee3c12d373a4fc31c6fc302a48f16fdef876d2878846b53549a36ac411&"/>
                    <NavLink className='action-title' to={'/groups'}>See All Groups</NavLink>
                    <p className="action-description">You can view the groups and find yourself a group that resonates with you!</p>
                </div>
                <div className="action-holder">
                    <img className='action-img' src="https://cdn.discordapp.com/attachments/421153749315092489/1187508322920833116/pngegg.png?ex=6597244f&is=6584af4f&hm=6709e28b58242d770ed1373b944478481f05baea09f926898dc30a9ef533c9b8&"/>
                    <NavLink className='action-title' to={'/events'}>Find an Event</NavLink>
                    <p className="action-description">See what everyone is up to. Peruse the many opportunities open to you and check out one you like!</p>
                </div>
                <div className="action-holder">
                    <img className='action-img' src="https://cdn.discordapp.com/attachments/421153749315092489/1187510798042529945/pngegg_1.png?ex=6597269d&is=6584b19d&hm=e0ed0570509efb8010af46fbb9b44e7247d1f6d223871d0f3cd1d2eeb133d2fd&"/>
                    {sessionUser ? <NavLink className='action-title' to={'/groups/new'}>Start a new group</NavLink> : <p className="disabled action-title">Start a group</p>}
                    <p className="action-description">Sound out your own call to your own breed of uniquely minded individuals!</p>
                </div>
            </div>
           {!sessionUser && <div id="button-div">
           <OpenModalMenuItem
              itemText="Join Meetup"
              modalComponent={<SignupFormModal />}
            />
            </div>}
        </div>
    )
}



function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <button id='join-button' onClick={onClick}>{itemText}</button>
  );
}
