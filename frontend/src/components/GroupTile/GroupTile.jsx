import { useNavigate } from "react-router-dom"

export default function GroupTile({ group }) {

    const navigate = useNavigate();

    function onClick() {
        navigate(`/groups/${group?.id}`);
    }
    console.log("Here is the group passed in", group)

    return (
        <div onClick={onClick}>
            <div>
                <img alt={`${group?.name} preview image`}/>
            </div>
            <div>
                <h5>{group?.name}</h5>
                <h5>{group?.private ? 'Private' : 'Public'}</h5>
            </div>
        </div>
    )

}
