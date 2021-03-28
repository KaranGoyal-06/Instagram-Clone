import React, { useEffect, useState, useContext } from 'react'

import { UserContext } from '../../App'

function Profile() {
    const [mypics, setPics] = useState([]) //useState hook to dynamically set images in the profile section
    const { state, dispatch } = useContext(UserContext) //destructuring state & dispatch that we passed in the UserContext.Provider as the value in app.js
    //state contains all the details of user when he is logged in and is null when he is not
    const [image, setImage] = useState("") //ustate hook for setting the image when user updates the pic



    useEffect(() => {
        fetch('/mypost', {  //get request for fetching data stored in database regarding all the posts posted by logged in user using /mypost route in post.js in server
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt") //passing token as user can only create post when signed in
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result.mypost)
                setPics(result.mypost) //setting data to the obtatined array of result.mypost containing info about all the posts
            })
    }, []) //passing empty array in the dependency array , so that hook renders in the mounting phase 


    useEffect(() => {//useeffect hook for  updating the image, it will run only when image exists 

        if (image) {
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

                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            //console.log(result)
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))//changing the pic url in local storage
                            dispatch({ type: "UPDATEPIC", payload: result.pic })//dispatching an action with payload of uploaded pic url
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])


    const updatePhoto = (file) => {
        setImage(file) //setting the image to the uploaded file 

    }



    return (
        <div style={{ maxWidth: "55rem", margin: "0rem auto" }}>
            <div style={{
                margin: "1.5rem 0rem",
                borderBottom: "0.1rem solid grey"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",

                }}>
                    <div>
                        <img style={{ width: "15rem", height: "15rem", borderRadius: "8rem" }}
                            src={state ? state.pic : "loading"}
                        />
                    </div>
                    <div>
                        {/* //dynamically passing the user name using state option only if it exists */}
                        <h4 className="profile-name" style={{ fontSize: "2.75rem", fontWeight: "500", marginBottom: "2rem" }}>{state ? state.name : "loading"}</h4>
                        <h5 style={{ fontSize: "2rem", fontWeight: "500", marginBottom: "2rem" }}>{state ? state.email : "loading"}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6 style={{ fontSize: "1.8rem", fontWeight: "500", marginRight: "1rem" }}>{mypics.length} Posts</h6>
                            {/* //dynamically showing the no. of followers and following */}
                            <h6 style={{ fontSize: "1.8rem", fontWeight: "500", marginRight: "1rem" }}>{state ? state.followers.length : "0"} Followers</h6>
                            <h6 style={{ fontSize: "1.8rem", fontWeight: "500" }}>{state ? state.following.length : "0"} Following</h6>
                        </div>

                    </div>
                </div>
                {/* //element for uploading the image to update */}
                <div className="file-field input-field" style={{ margin: "1rem" }}>
                    <div className="btn">
                        <span style={{ fontSize: "1.5rem", padding: "1rem", paddingTop: "0rem" }}>Update Image</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => { //using map method to dynamically assign properties to each element, item refres to data and data refers to reult.mypost array that contain all info about posts
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title}></img>
                        )
                    })
                }

            </div>
        </div>
    )
}

export default Profile
