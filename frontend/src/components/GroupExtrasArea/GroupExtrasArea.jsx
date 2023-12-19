import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thunkGetGroupEvents } from "../../store/events";
import { useRef } from "react";
import GroupEventsTile from "../GroupEventsTile/GroupEventsTile.jsx";
// import { useNavigate } from "react-router-dom";

export default function GroupExtrasArea( { group } ) {
    const ref = useRef();

    const dispatch = useDispatch();

    const past = useSelector((state) => state.events.Past[group?.id]);

    const upcoming = useSelector((state) => state.events.Upcoming[group?.id])

    useEffect(() => {
        dispatch(thunkGetGroupEvents(group?.id));
    }, [dispatch]);


    return (
        <div ref={ref}>
            <div>
                <h2>Organizer</h2>
                <h5>{`${group?.Organizer.firstName} ${group?.Organizer.lastName}`}</h5>
            </div>
            <div>
                <h2>What we&#39;re about</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <span>
                {upcoming?.length > 0 && <h2>Upcoming Events &#40;{upcoming?.length}&#41;</h2>}
                <ul>
                    {upcoming?.map((event) => (
                        <li key={event?.id}><GroupEventsTile event={event}/></li>
                    ))}
                </ul>
            </span>
            <span>
                {past?.length > 0 && <h2>Past Events &#40;{past?.length}&#41;</h2>}
                <ul>
                    {past?.map((event) => (
                        <li key={event?.id}><GroupEventsTile event={event}/></li>
                    ))}
                </ul>
            </span>
        </div>
    )
}
