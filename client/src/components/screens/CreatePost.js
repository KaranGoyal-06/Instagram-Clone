import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'

function CreatePost() {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")


    const postDetails = () => {
        //Part 1 -> writing code to upload our image to cloudinary 
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


    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title: title,
                    body: body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#d50000 red accent-4" })
                    } else {
                        M.toast({ html: "Successfully Created Post", classes: "#2e7d32 green darken-3" })
                        history.push('/')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])



    return (
        <div className="card input-field"
            style={{
                margin: "8rem auto",
                maxWidth: "80rem",
                padding: "2rem",
                textAlign: "center"

            }}
        >
            <h1 className="createpost">Create Post</h1>
            <input style={{ fontSize: "1.5rem" }} type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
            <input style={{ fontSize: "1.5rem" }} type="text" placeholder="body" value={body} onChange={(e) => setBody(e.target.value)}></input>
            <div className="file-field input-field" >
                <div className="btn">
                    <span style={{ fontSize: "1.5rem", padding: "1rem", paddingTop: "0rem" }}>Upload Image</span>
                    <input style={{ fontSize: "1.5rem" }} type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button style={{ fontSize: "1.5rem", padding: "1rem", paddingTop: "0rem" }} className="btn waves-effect waves-light" onClick={() => postDetails()}>Submit Post</button>
        </div>
    )
}

export default CreatePost
