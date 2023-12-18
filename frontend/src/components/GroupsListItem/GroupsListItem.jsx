// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useState } from 'react';

export default function GroupListItem({ group }) {

    return (
        <li className='GroupItem'>
            <div>
                <img src={group.previewImage}/>
            </div>
            <div>
                <h2 className='group-name'>{group.name}</h2>
                <h5 className='group-location'>{`${group.city}, ${group.state}`}</h5>
                <p className='group-about-preview'>{group.about.slice(0, 30)}</p>
                <div className='group-details'>
                    <h5># {'Number of group events'} events</h5>
                    <h5>&bull;</h5>
                    <h5>{group.private ? "Private": "Public"}</h5>
                </div>
            </div>
        </li>
    )
}
