import {useState, useEffect} from "react"
import "../styles/side-drawer.css"
import {NavLink} from "react-router-dom"

const SideDrawer = ({showSideDrawerState, hideSideDrawer}) => {

    const [drawerClassList, setDrawerClassList] = useState("");
    const [drawerContainerClassList, setDrawerContainerClassList] = useState("side-drawer-container")
    useEffect(() => {

        if(drawerClassList === "") {
           setDrawerClassList("side-drawer");
           return;
        }

        if(showSideDrawerState) {
            setDrawerContainerClassList("side-drawer-container show-side-drawer")
            setDrawerClassList("side-drawer");
        } else {
            setDrawerClassList("side-drawer slide-out-side-drawer");
            // wait until the side drawer is no more visible before taking away rh container
            setTimeout(() => {
                setDrawerContainerClassList("side-drawer-container")
            }, 300)
        }
        // eslint-disable-next-line
    }, [showSideDrawerState])

    const hideWithBackdropClick = (e) => {
        if(e.target.id === "side-drawer-backdrop") hideSideDrawer()
    }

    return(
        <div className = {drawerContainerClassList} onClick = {hideWithBackdropClick} id = "side-drawer-backdrop">
            <div className = {drawerClassList}>
                <i className="back-arrow fa fa-arrow-circle-left" onClick = {hideSideDrawer}></i>
                <h2 className = "logo-text">TEST PROJECT</h2>
                <nav className = "navigation">
                    <ul className = "nav-links-wrapper">
                        <li className = "nav-link-items"><NavLink activeClassName = "active-page-link" onClick = {hideSideDrawer} exact to ="/">Profiles</NavLink></li>
                        <li className = "nav-link-items"><NavLink activeClassName = "active-page-link" onClick = {hideSideDrawer} to = "/create-profile">Create Profile</NavLink></li>
                    </ul>
                </nav>
            </div>
        </div>            
    );
}

export default SideDrawer;