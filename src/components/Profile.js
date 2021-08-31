import "../styles/profile.css"

const Profile = ({profileInfo: {profileAddress, profileId, firstName, lastName}}) => {
    return (
        <div className = "profile">
            <div className = "address-id">
                <p className = "profile-address">{`${profileAddress.substr(0, 6)}...${profileAddress.substr(profileAddress.length-4, profileAddress.length)}`}</p>
                <p className = "profile-id">Profile_Id: {profileId}</p>
            </div>
            <div className = "profile-info">
                <div className = "firstName">
                    <p className = "key">First Name</p>
                    <p className = "value">{firstName}</p>
                </div>
                <div className = "lastName">
                    <p className = "key">Last Name</p>
                    <p className = "value">{lastName}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;