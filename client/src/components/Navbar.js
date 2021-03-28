import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'



const Navbar = () => {

    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()


    const renderList = () => {

        if (state) {
            return [

                <ul> <li key="2"><Link to="/profile">
                    <i className="material-icons account" style={{ fontSize: "2.75rem" }}>account_circle</i></Link></li>,
                <li key="3"><Link to="/create"><i className="material-icons" style={{ fontSize: "2.5rem" }}>add_to_photos</i></Link></li>,
                <li className="explore" key="4"><Link style={{ fontSize: "2rem", fontWeight: "500" }} to="/myfollowingpost">Explore</Link></li>,
                <li key="5"><button style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem" }} className="btn lout"
                        onClick={() => {

                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            history.push('/signin')

                        }}>Logout</button>
                    </li ></ul>
            ]
        } else {
            return [
                <ul> <li key="6"><Link className="login" to="/signin">Signin</Link></li>,
                <li key="7"><Link className="logup" to="/signup">Signup</Link></li></ul>
            ]
        }
    }





    return (
        <nav>
            <div className="nav-wrapper white ">

                <Link to={state ? "/" : "/signin"} className="brand-logo left" style={{ fontSize: "3rem" }}>Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>


        </nav>
    )
}

export default Navbar

