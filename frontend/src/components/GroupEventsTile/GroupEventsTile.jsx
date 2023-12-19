export default function GroupEventsTile( { event } ) {

    // console.log(event);

    return (
        <>
            <div>
                <div>
                    <div><img src={event.previewImage} alt={`${event.name} preview image`}/></div>
                    <div>
                        <h5>{`${new Date (event.startDate)}`.slice(0, 21)}</h5>
                        <h3>{event.name}</h3>
                    </div>
                </div>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
        </>
    )
}
