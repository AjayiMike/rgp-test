import "../styles/profiles.css";
import Profile from "../components/Profile"

const Profiles = ({profiles}) => {
    return(
        <div className = "profiles-page-content">
            <h1 className = "page-heading">All Profiles</h1>
            <div className = "profile-container">
                {profiles.length !==0 && profiles.map((profile, index) => {
                    return <Profile key = {index} profileInfo = {profile} />
                })}
            </div>
        </div>
    );
}

export default Profiles;