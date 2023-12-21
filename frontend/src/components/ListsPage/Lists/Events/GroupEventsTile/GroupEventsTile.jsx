import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function GroupEventsTile( { event } ) {

    const navigate = useNavigate();

    function onClick() {
        navigate(`/events/${event.id}`);
    }

    return (
        <>
            <div onClick={onClick}>
                <div>
                    <div><img src={event.previewImage} alt={`${event.name} preview image`}/></div>
                    <div>
                        <h5>{`${new Date (event.startDate)}`.slice(0, 21)}</h5>
                        <h3>{event.name}</h3>
                    </div>
                </div>
                <p>
                    {event.description}
                </p>
            </div>
        </>
    )
}
