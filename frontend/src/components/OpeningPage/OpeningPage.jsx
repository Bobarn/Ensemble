import ActionNavigation from "./ActionNavigation/ActionNavigation";
import './OpeningPage.css'

export default function OpeningPage() {

    return (
        <div  id="landing-main">
            <div id="landing-intro">
                <div className='landing-intro-content' id="landing-intro-words">
                    <h1>The people platform-- Where interests become friendships</h1>
                    <p>Sometimes you just need to find someone to be weird with you. Or maybe you want to try a different kind of different? Or you&#39;re just looking for something finally normal in your life. We got you, come find others looking for the same.</p>
                </div>
                <div className='landing-intro-content' id="landing-intro-pic">
                    <img src="https://secure.meetupstatic.com/next/images/indexPage/irl_event.svg?w=384"/>
                </div>
            </div>
            <ActionNavigation />
        </div>
    )
}
