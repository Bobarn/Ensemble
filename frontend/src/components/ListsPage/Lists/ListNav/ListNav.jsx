import { NavLink } from "react-router-dom"
export default function ListNav() {

    return (
    <div>
        <NavLink to='/events'>Events</NavLink>
        <NavLink to='/groups' end>Groups</NavLink>
    </div>
    )
}
