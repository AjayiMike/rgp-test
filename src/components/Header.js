import "../styles/header.css"
import {NavLink} from "react-router-dom"

const Header = ({displaySideDrawer, userAccount, connectWallet}) => {
    return(
        <header>
            <div className = "logo">
                <i className="hamburger fas fa-bars" onClick = {displaySideDrawer}></i>
                <h2 className = "logo-text">TEST PROJECT</h2>
            </div>
            <nav className = "navigation">
                <ul className = "nav-links-wrapper">
                    <li className = "nav-link-items"><NavLink activeClassName = "active-page-link" exact to ="/">Profiles</NavLink></li>
                    <li className = "nav-link-items"><NavLink activeClassName = "active-page-link" to = "/create-profile">Create Profile</NavLink></li>
                </ul>
            </nav>
            {userAccount.address ? <div className = "account">
                <span className = "balance">{userAccount.balance} ETH</span>
                <span className = "address">{`${userAccount.address.substr(0, 6)}...${userAccount.address.substr(userAccount.address.length-4, userAccount.address.length)}`}</span>
            </div> : 
            <button className = "connect-btn" onClick = {connectWallet}>Connect</button>}
        </header>
    );
}

export default Header;