import { NavLink } from "react-router-dom"
import './ListNav.css'

export default function ListNav() {

    return (
    <div id="list-nav">
        <NavLink className='list-nav-link' to='/events'>Events</NavLink>
        <NavLink className='list-nav-link' to='/groups' end>Groups</NavLink>
    </div>
    )
}
