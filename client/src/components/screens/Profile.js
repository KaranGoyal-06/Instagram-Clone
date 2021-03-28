import React, { useEffect, useState, useContext } from 'react'

import { UserContext } from '../../App'

function Profile() {
    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)

    const [image, setImage] = useState("")


    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result.mypost)
                setPics(result.mypost)
            })
    }, [])


    useEffect(() => {

        if (image) {
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
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])


    const updatePhoto = (file) => {
        setImage(file)
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
                    mypics.map(item => {
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
