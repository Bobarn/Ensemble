import { NavLink } from "react-router-dom";
import './ActionNavigation.css';

export default function ActionNavigation() {

    return (
        <div>
            <div className="MeetUpInstructions">
                <h3>How Meetup works</h3>
                <p>Placement text about the functionality of meetup and how it can help anyone looking for a community.</p>
            </div>
            <div>
                <div className="actionHolder">
                    <img src="#"/>
                    <NavLink to={'/groups'}>See All Groups</NavLink>
                    <p>You can view the groups and find yourself a group that resonates with you!</p>
                </div>
                <div className="actionHolder">
                    <img src="#"/>
                    <NavLink to={'/'}>Find an Event</NavLink>
                    <p>See what everyone is up to. Peruse the many opportunities open to you and check out one you like!</p>
                </div>
                <div className="actionHolder">
                    <img src="#"/>
                    <NavLink to={'/groups/new'}>Start a new group</NavLink>
                    <p>Sound out your own call to your own breed of uniquely minded individuals!</p>
                </div>
            </div>
            <div>
                <button>Join Meetup</button>
            </div>
        </div>
    )
}
