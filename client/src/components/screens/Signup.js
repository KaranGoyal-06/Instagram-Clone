import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css' //importing our UI framework materialize

function Signup() {
    const history = useHistory()
    const [name, SetName] = useState("")
    const [password, SetPassword] = useState("")
    const [email, SetEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "dxh5wpled")
        fetch("https://api.cloudinary.com/v1_1/dxh5wpled/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const uploadFields = () => {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            M.toast({ html: "Invalid email", classes: "#d50000 red accent-4" })
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                password: password,
                email: email,
                pic: url
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

    const PostData = () => {
        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field" style={{ maxWidth: "80rem", marginTop: "7rem" }}>
                <h2 style={{ fontSize: "5rem", marginBottom: "2rem" }}> Instagram</h2>
                <input style={{ marginBottom: "1rem", fontSize: "1.5rem" }} type="text" placeholder="name" value={name} onChange={(e) => SetName(e.target.value)} />
                <input style={{ marginBottom: "1rem", fontSize: "1.5rem" }} type="text" placeholder="email" value={email} onChange={(e) => SetEmail(e.target.value)} />
                <input style={{ marginBottom: "1rem", fontSize: "1.5rem" }} type="password" placeholder="password" value={password} onChange={(e) => SetPassword(e.target.value)} />
                <div className="file-field input-field" >
                    <div className="btn">
                        <span style={{ padding: "1rem", paddingTop: "0rem", fontSize: "1.5rem" }}>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <button style={{ fontSize: "2rem", padding: "1rem", paddingTop: "0rem" }} className="btn waves-effect waves-light" onClick={() => PostData()}>Signup</button>
                {/* //calling the postdata function on click of button */}
                <h5 style={{ fontWeight: "500", fontSize: "1.75rem" }}>
                    <Link to="/signin">Already have an account?</Link>
                </h5>
            </div>
        </div >
    )
}

export default Signup