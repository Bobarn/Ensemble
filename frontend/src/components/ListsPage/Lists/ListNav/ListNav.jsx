import { NavLink } from "react-router-dom"
import './ListNav.css'

export default function ListNav() {

    return (
    <div className="list-nav">
        <NavLink className='list-nav-link' to='/events'>Events</NavLink>
        <NavLink className='list-nav-link' to='/groups'>Groups</NavLink>
    </div>
    )
}
