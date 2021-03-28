import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

function Profile() {
    const [userProfile, setProfile] = useState(null)

    const { state, dispatch } = useContext(UserContext)


    const { userid } = useParams()
    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)


    useEffect(() => {
        fetch(`/profile/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setProfile(result)
            })
    }, [])


    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } }) //dispatching the updated following and followers array payload to the userReducer.js
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {

                    return {

                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
            })

    }


    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {

                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return {

                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)
            })

    }



    return (
        <>
            { userProfile ?


                <div style={{ maxWidth: "55rem", margin: "0rem auto" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "1.8rem 0rem",
                        borderBottom: "0.1rem solid grey"

                    }}>
                        <div>
                            <img style={{ width: "15rem", height: "15rem", borderRadius: "8rem", marginBottom: "2rem" }}
                                src={userProfile.user.pic}
                            />
                        </div>
                        <div>

                            <h4 style={{ fontSize: "2.75rem", fontWeight: "500", marginBottom: "2rem" }}>{userProfile.user.name}</h4>
                            <h5 style={{ fontSize: "2rem", fontWeight: "500", marginBottom: "1.5rem" }}>{userProfile.user.email}</h5>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                {/* //dynamically showing number of posts posted by the user  */}
                                <h6 style={{ fontSize: "1.8rem", fontWeight: "500", marginRight: "0rem" }}>{userProfile.posts.length} Posts</h6>
                                {/* //dynamically setting the followers and following array in profile */}
                                <h6 style={{ fontSize: "1.8rem", fontWeight: "500", marginRight: "0rem" }}>{userProfile.user.followers.length} Followers</h6>
                                <h6 style={{ fontSize: "1.8rem", fontWeight: "500", marginBottom: "2rem" }}>{userProfile.user.following.length} Following</h6>
                            </div>
                            {showfollow ? //if showfollow is false, then we will see the follow button
                                <button style={{ fontSize: "1.5rem", padding: "1rem", paddingTop: "0rem", marginBottom: "2rem" }} className="btn waves-effect waves-light" onClick={() => followUser()}>Follow</button>
                                : //and if showfollow is true, then we will see the unfollow button
                                <button style={{ fontSize: "1.5rem", padding: "1rem", paddingTop: "0rem", marginBottom: "2rem" }} className="btn waves-effect waves-light" onClick={() => unfollowUser()}>Unfollow</button>
                            }
                        </div>
                    </div>

                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title}></img>
                                )
                            })
                        }

                    </div>
                </div>


                : <h2>Loading Profile</h2>}

        </>
    )
}

export default Profile
