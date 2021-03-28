import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

import M from 'materialize-css'


function Reset() {

    const history = useHistory()

    const [email, SetEmail] = useState("")

    const PostData = () => {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            M.toast({ html: "Invalid email", classes: "#d50000 red accent-4" })
            return
        }
        fetch('/reset-password', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email
            })
        }).then(res => res.json())
            .then(data => {

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
                <input style={{ marginBottom: "2rem" }} type="text" placeholder="email" value={email} onChange={(e) => SetEmail(e.target.value)} />

                <button className="btn waves-effect waves-light" onClick={() => PostData()}>Reset Password</button>

            </div>
        </div>
    )
}

export default Reset
