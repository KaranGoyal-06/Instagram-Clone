import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'

function CreatePost() {
    const history = useHistory()
    const [title, setTitle] = useState("") //ustate hook for setting the title value when post is created by the user
    const [body, setBody] = useState("") //ustate hook for setting the body value when post is created by the user
    const [image, setImage] = useState("") //ustate hook for setting the image file when post is created by the user
    const [url, setUrl] = useState("")


    const postDetails = () => { //creating a function for uploading our image and creating our post
        //Part 1 -> writing code to upload our image to cloudinary 
        const data = new FormData() //using formData and fetch(uploading a file) for image uploading
        data.append("file", image) //appending the type of file to upload i.e image
        data.append("upload_preset", "insta-clone") //upload preset that we created in cloudinary
        data.append("cloud_name", "dxh5wpled") //our cloudinary cloud name
        fetch("https://api.cloudinary.com/v1_1/dxh5wpled/image/upload", { //URL to be requested is API base URL/image/upload present on home page of cloudinary 
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => { //it will return the object containing all the details of oue uploaded image like uploaded image's cloudinary URL
                setUrl(data.url) //setting the url as the url of the uploaded image
            })
            .catch(err => {
                console.log(err)
            })
    }


    useEffect(() => {//we are putting this part of code in useEffect hook because it will take some time to get 1st part of code to be implemented
        //So this part of code will implement only after url has been setted by the setUrl method
        //Part 2 -> writing code to send a post request to /createpost and also uploading our image from cloudinary's Url
        if (url) { //code will only run when there is URL
            fetch("/createpost", { //using fetch API to post the post's data to our createpost route created in the server folder in auth.js
                method: "post", //sending the post request
                headers: {
                    "Content-Type": "application/json", //the data to be posted in the json format
                    "Authorization": "Bearer " + localStorage.getItem("jwt") //passing the token in the header to acces the protected routes
                },
                body: JSON.stringify({ //will convert the existing data entered by the user to the json format, the content type in header should match the body type
                    title: title,
                    body: body,
                    pic: url //uploading our image from cloudinary's Url
                })
            }).then(res => res.json()) //it parses the json response from fetch into native javascript objects
                .then(data => { // data include javascript objects parsed from res.json
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#d50000 red accent-4" }) //creating toast to display error on client UI using materialize and in the second arguement changing the color
                    } else { //this will run if there is no error
                        M.toast({ html: "Successfully Created Post", classes: "#2e7d32 green darken-3" })
                        history.push('/') //navigating the user to home screen after succesfully creating post using usehistory hook
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url]) //passing the url in the dependency array so that code will run only when it's updated



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
