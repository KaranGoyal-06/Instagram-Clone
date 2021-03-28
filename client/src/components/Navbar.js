import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'
//import { query } from 'express'


const Navbar = () => {

    const { state, dispatch } = useContext(UserContext) //destructuring state & dispatch that we passed in the UserContext.Provider as the value in app.js
    const history = useHistory() //importing useHistory for redirecting the user to sign in page on logging out


    const renderList = () => {//this is a function to dynamically render the links like signin, signup, profile etc.
        //console.log(state)
        if (state) { //if state is available i.e means user is signed in, then this will implement 
            return [
                //<li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
                <ul> <li key="2"><Link to="/profile">
                    <i className="material-icons account" style={{ fontSize: "2.75rem" }}>account_circle</i></Link></li>,
                <li key="3"><Link to="/create"><i className="material-icons" style={{ fontSize: "2.5rem" }}>add_to_photos</i></Link></li>,
                <li className="explore" key="4"><Link style={{ fontSize: "2rem", fontWeight: "500" }} to="/myfollowingpost">Explore</Link></li>,
                <li key="5"><button style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem" }} className="btn lout" //implementing the logout button when user is logged in, on click it will simply 
                        onClick={() => {

                            localStorage.clear() //clear the user details stored in the local storage
                            dispatch({ type: "CLEAR" }) //and dispatch the action type CLEAR to the userReducer.js
                            history.push('/signin') //will redirect the user to sign in page on logging out

                        }}>Logout</button>
                    </li ></ul>
            ]
        } else { //if state is not  available i.e means user is not signed in, then this will implement 
            return [
                <ul> <li key="6"><Link className="login" to="/signin">Signin</Link></li>,
                <li key="7"><Link className="logup" to="/signup">Signup</Link></li></ul>
            ]
        }
    }





    return (
        <nav>
            <div className="nav-wrapper white ">
                {/* //in the below statement we are creating logic, so that the user is enable to access the home page only when he is logged in */}
                <Link to={state ? "/" : "/signin"} className="brand-logo left" style={{ fontSize: "3rem" }}>Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>


        </nav>
    )
}

export default Navbar

