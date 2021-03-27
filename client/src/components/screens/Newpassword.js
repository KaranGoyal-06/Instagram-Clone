import React, { useState, useContext } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import M from 'materialize-css'


function Login() {

    const history = useHistory()
    const [password, SetPassword] = useState("") //ustate hook for setting the password value when entered by user
    const { token } = useParams()
    //console.log(token)


    const PostData = () => { //function for posting signin data to our server

        fetch("/new-password", { //using fetch API to post data to our signin route created in the server folder in auth.js
            method: "post", //sending the post request
            headers: {
                "Content-Type": "application/json" //the data to be posted in the json format
            },
            body: JSON.stringify({ //will convert the existing data entered by the user to the json format, the content type in header should match the body type
                password: password,
                token: token
            })
        }).then(res => res.json()) //it parses the json response from fetch into native javascript objects
            .then(data => { // data include javascript objects parsed from res.json
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#d50000 red accent-4" }) //creating toast to display error on client UI using materialize and in the second arguement changing the color
                } else { //this will run if there is no error

                    M.toast({ html: data.message, classes: "#2e7d32 green darken-3" })
                    history.push('/signin') //navigating the user to home screen after succesfully signing in using usehistory hook
                }
            }).catch(err => {
                console.log(err)
            })
    }


    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2> Instagram</h2>

                <input type="password" placeholder="Enter New Password" value={password} onChange={(e) => SetPassword(e.target.value)} />
                <button className="btn waves-effect waves-light" onClick={() => PostData()}>Update Password</button>

            </div>
        </div>
    )
}

export default Login
