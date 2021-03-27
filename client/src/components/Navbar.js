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
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingpost">My Following Posts</Link></li>,
                <li key="5"><button className="btn #d50000 red accent-4" //implementing the logout button when user is logged in, on click it will simply 
                    onClick={() => {

                        localStorage.clear() //clear the user details stored in the local storage
                        dispatch({ type: "CLEAR" }) //and dispatch the action type CLEAR to the userReducer.js
                        history.push('/signin') //will redirect the user to sign in page on logging out

                    }}>Logout</button>
                </li >
            ]
        } else { //if state is not  available i.e means user is not signed in, then this will implement 
            return [
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }





    return (
        <nav>
            <div className="nav-wrapper white">
                {/* //in the below statement we are creating logic, so that the user is enable to access the home page only when he is logged in */}
                <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>


        </nav>
    )
}

export default Navbar

