import { useNavigate } from "react-router-dom";
import './GroupEventsTile.css'

export default function GroupEventsTile( { event } ) {

    const navigate = useNavigate();

    function onClick() {
        navigate(`/events/${event.id}`);
    }

    return (
        <div className="block">
            <div className="event" onClick={onClick}>
                <div className="event-display">
                    <div className="event-image-container"><img className="event-image" src={event.previewImage} alt={`${event.name} preview image`}/></div>
                    <div className="event-information">
                        <h5>{`${new Date(event?.startDate).toLocaleString('en-us', {timeZone: 'PST8PDT'})}`.slice(0, 22)}</h5>
                        <h3>{event.name}</h3>
                        <h5>{`${event.Group.city}, ${event.Group.state}`}</h5>
                    </div>
                </div>
                <p className="event-description">
                    {event.description}
                </p>
            </div>
        </div>
    )
}
