import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'


function Login() {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const [password, SetPassword] = useState("")
    const [email, SetEmail] = useState("")

    const PostData = () => {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            M.toast({ html: "Invalid email", classes: "#d50000 red accent-4" })
            return
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#d50000 red accent-4" })
                } else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Signed In", classes: "#2e7d32 green darken-3" })
                    history.push('/')
                }
            }).catch(err => {
                console.log(err)
            })
    }


    return (
        <div className="mycard">
            <div className="card auth-card input-field" style={{ maxWidth: "80rem", marginTop: "8rem" }}>
                <h2 style={{ fontSize: "5rem", marginBottom: "4rem" }}> Instagram</h2>
                <input style={{ marginBottom: "3rem", fontSize: "1.5rem" }} type="text" placeholder="email" value={email} onChange={(e) => SetEmail(e.target.value)} />
                <input style={{ marginBottom: "3rem", fontSize: "1.5rem" }} type="password" placeholder="password" value={password} onChange={(e) => SetPassword(e.target.value)} />
                <button style={{ fontSize: "2rem", marginBottom: "1.5rem", padding: "1rem", paddingTop: "0rem" }} className="btn waves-effect waves-light" onClick={() => PostData()}>Login</button>
                <h5 style={{ fontSize: "2rem", fontWeight: "500", marginBottom: "2rem" }}>
                    <Link to="/signup">New User?</Link>
                </h5>
                <h6 style={{ fontSize: "1.5rem", fontWeight: "400" }}>
                    <Link to="/reset">Forgot Password?</Link>
                </h6>

            </div>
        </div>
    )
}

export default Login
