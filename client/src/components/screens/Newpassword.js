import React, { useState, useContext } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import M from 'materialize-css'


function Login() {

    const history = useHistory()
    const [password, SetPassword] = useState("")
    const { token } = useParams()
    //console.log(token)


    const PostData = () => {

        fetch("/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                token: token
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#d50000 red accent-4" })
                } else {

                    M.toast({ html: data.message, classes: "#2e7d32 green darken-3" })
                    history.push('/signin')
                }
            }).catch(err => {
                console.log(err)
            })
    }


    return (
        <div className="mycard">
            <div className="card auth-card input-field" style={{ maxWidth: "70rem" }}>
                <h2 style={{ fontSize: "5rem", marginBottom: "2rem" }}> Instagram</h2>

                <input style={{ marginBottom: "2rem" }} type="password" placeholder="Enter New Password" value={password} onChange={(e) => SetPassword(e.target.value)} />
                <button className="btn waves-effect waves-light" onClick={() => PostData()}>Update Password</button>

            </div>
        </div>
    )
}

export default Login
