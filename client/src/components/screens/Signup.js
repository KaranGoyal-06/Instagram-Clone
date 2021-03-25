import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css' //importing our UI framework materialize

function Signup() {
    const history = useHistory()
    const [name, SetName] = useState("") //ustate hook for setting the name value when entered by user
    const [password, SetPassword] = useState("") //ustate hook for setting the password value when entered by user
    const [email, SetEmail] = useState("") //ustate hook for setting the email value when entered by user
    const [image, setImage] = useState("") //ustate hook for setting the image when user is signed up
    const [url, setUrl] = useState(undefined) //ustate hook for setting the url of image when user is signed up, it is set to undefined so that when pic is not uploaded when signed up, the default pic will set

    useEffect(() => { //this will implement if pic url is present
        if (url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = () => { //function for uploading a pic
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

    const uploadFields = () => {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) { //this is an email regex it is used to validate email format, it returns a boolean value, if this returns true the whole code below won't execute
            M.toast({ html: "Invalid email", classes: "#d50000 red accent-4" })
            return
        }
        fetch("/signup", { //using fetch API to post data to our signup route created in the server folder in auth.js
            method: "post", //sending the post request
            headers: {
                "Content-Type": "application/json" //the data to be posted in the json format
            },
            body: JSON.stringify({ //will convert the existing data entered by the user to the json format, the content type in header should match the body type
                name: name,
                password: password,
                email: email,
                pic: url
            })
        }).then(res => res.json()) //it parses the json response from fetch into native javascript objects
            .then(data => { // data include javascript objects parsed from res.json
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#d50000 red accent-4" }) //creating toast to display error on client UI using materialize and in the second arguement changing the color
                } else { //this will run if there is no error
                    M.toast({ html: data.message, classes: "#2e7d32 green darken-3" })
                    history.push('/signin') //navigating the user to login screen after succesfully signing up using usehistory hook
                }
            }).catch(err => {
                console.log(err)
            })
    }

    const PostData = () => { //function for posting signup data to our server
        if (image) { //if user sign up with pic
            uploadPic()
        } else { //if user sign up without uploading pic
            uploadFields()
        }
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2> Instagram</h2>
                <input type="text" placeholder="name" value={name} onChange={(e) => SetName(e.target.value)} />
                <input type="text" placeholder="email" value={email} onChange={(e) => SetEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e) => SetPassword(e.target.value)} />
                <div className="file-field input-field" >
                    <div className="btn">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <button className="btn waves-effect waves-light" onClick={() => PostData()}>Signup</button>
                {/* //calling the postdata function on click of button */}
                <h5>
                    <Link to="/signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup