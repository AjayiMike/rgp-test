import "../styles/create-profile.css"



const CreateProfile = ({createProfile, onNamesChange, newProfileData, connected, loaderState, connectWallet}) => {

    const onClickButton = (e) => {
        e.preventDefault()
        if(connected) {
            createProfile()
        } else {
            connectWallet()
        }
    }


    return(
        <div className = "create-profile">
            <h1 className = "page-heading">CREATE A PROFILE</h1>
            {!connected && <span className = "connect-wallet-notice">It is required that you connect your wallet first!</span>}
            <form className = "create-profile-form">
                <div className = "form-group">
                    <label htmlFor = "first-name">First Name</label>
                    <input type = "text" id = "first-name" placeholder = "John" name = "firstName" onChange = {onNamesChange} value = {newProfileData.firstName}/>
                </div>
                <div className = "form-group">
                    <label htmlFor = "last-name">Last Name</label>
                    <input type = "text" id = "last-name" placeholder = "Doe" name = "lastName" onChange = {onNamesChange} value = {newProfileData.lastName}/>
                </div>
                <button className = "create-profile-btn" onClick = {onClickButton}>{!connected ? "CONNECT WALLET" : "CREATE PROFILE" }{loaderState && <i className='spinner-icon fas fa-circle-notch'></i>}</button>
            </form>

        </div>
    );
}

export default CreateProfile;