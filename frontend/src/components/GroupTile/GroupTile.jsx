import { useNavigate } from "react-router-dom"

export default function GroupTile({ group }) {

    const navigate = useNavigate();

    function onClick() {
        navigate(`/groups/${group?.id}`);
    }

    return (
        <div onClick={onClick}>
            <div>
                <img src={group?.GroupImages?.find((image) => image.preview === true)?.url} alt={`${group?.name} preview image`}/>
            </div>
            <div>
                <h5>{group?.name}</h5>
                <h5>{group?.private ? 'Private' : 'Public'}</h5>
            </div>
        </div>
    )

}
