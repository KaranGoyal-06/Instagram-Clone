import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'


function Login() {
    const { state, dispatch } = useContext(UserContext) //destructuring state & dispatch that we passed in the UserContext.Provider as the value in app.js
    const history = useHistory()
    const [password, SetPassword] = useState("") //ustate hook for setting the password value when entered by user
    const [email, SetEmail] = useState("") //ustate hook for setting the email value when entered by user

    const PostData = () => { //function for posting signin data to our server
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) { //this is an email regex it is used to validate email format, it returns a boolean value, if this returns true the whole code below won't execute
            M.toast({ html: "Invalid email", classes: "#d50000 red accent-4" })
            return
        }
        fetch("/signin", { //using fetch API to post data to our signin route created in the server folder in auth.js
            method: "post", //sending the post request
            headers: {
                "Content-Type": "application/json" //the data to be posted in the json format
            },
            body: JSON.stringify({ //will convert the existing data entered by the user to the json format, the content type in header should match the body type
                password: password,
                email: email
            })
        }).then(res => res.json()) //it parses the json response from fetch into native javascript objects
            .then(data => { // data include javascript objects parsed from res.json
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#d50000 red accent-4" }) //creating toast to display error on client UI using materialize and in the second arguement changing the color
                } else { //this will run if there is no error
                    localStorage.setItem("jwt", data.token) //saving the token generated after sign in to the local storage, so that it can be accessed to open protected routes
                    localStorage.setItem("user", JSON.stringify(data.user)) //saving the user details to local storage
                    dispatch({ type: "USER", payload: data.user }) //dispatch user details payload to userReducer.js
                    M.toast({ html: "Signed In", classes: "#2e7d32 green darken-3" })
                    history.push('/') //navigating the user to home screen after succesfully signing in using usehistory hook
                }
            }).catch(err => {
                console.log(err)
            })
    }


    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2> Instagram</h2>
                <input type="text" placeholder="email" value={email} onChange={(e) => SetEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e) => SetPassword(e.target.value)} />
                <button className="btn waves-effect waves-light" onClick={() => PostData()}>Login</button>
                <h5>
                    <Link to="/signup">New User?</Link>
                </h5>

            </div>
        </div>
    )
}

export default Login