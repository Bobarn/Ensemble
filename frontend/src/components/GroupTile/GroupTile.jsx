import { useNavigate } from "react-router-dom"
import './GroupTile.css'

export default function GroupTile({ group }) {

    const navigate = useNavigate();

    function onClick() {
        navigate(`/groups/${group?.id}`);
    }

    return (
        <div id="group-tile" onClick={onClick}>
            <div id="group-tile-img-container">
                <img id="group-tile-img" src={group?.GroupImages?.find((image) => image.preview === true)?.url} alt={`${group?.name} preview image`}/>
            </div>
            <div id="group-tile-info">
                <h5>{group?.name}</h5>
                <h6>{group?.private ? 'Private' : 'Public'}</h6>
            </div>
        </div>
    )

}
