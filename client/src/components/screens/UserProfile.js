import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

function Profile() { //function to dynamically show different user's profile, the backend logic is in routes folder in user.js in server
    const [userProfile, setProfile] = useState(null) //useState hook to dynamically set profile of different users

    const { state, dispatch } = useContext(UserContext) //destructuring state & dispatch that we passed in the UserContext.Provider as the value in app.js
    //state contains all the details of user when he is logged in and is null when he is not

    const { userid } = useParams() //accessing userid from params using useParams hook
    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true) //useState hook for changing follow button from follow to unfollow or vice versa


    useEffect(() => {
        fetch(`/profile/${userid}`, {  //get request for fetching data stored in database regarding all the posts posted by the user and the user to show on the /profile/userid route
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt") //passing token as user can only create post when signed in
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setProfile(result) //setting profile to the obtatined object of result  containing info about all the posts and the user
            })
    }, []) //passing empty array in the dependency array , so that hook renders in the mounting phase 


    const followUser = () => { //function for dynamically implementing the follow and following in the UI, 
        fetch('/follow', { //put request to /follow route defined in user.js in server side
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ //sending the id of the user which is to followed to the /follow route.
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } }) //dispatching the updated following and followers array payload to the userReducer.js
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {//setting the state when user followed some other user

                    return { //we are basically want to get the id of the following person to the followers array of followed user
                        //for this purpose as every entry is either object or array, we have to use spread operator repeatedly to merge states
                        ...prevState, //spreading the previous state
                        user: {
                            ...prevState.user, //spreading the previous state.user
                            followers: [...prevState.user.followers, data._id] //spreading the previous state.user.followers and setting the id in followers array
                        }
                    }
                })
                setShowFollow(false)
            })

    }


    const unfollowUser = () => { //function for dynamically implementing the unfollow and following in the UI, 
        fetch('/unfollow', { //put request to /unfollow route defined in user.js in server side
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ //sending the id of the user which is to unfollowed to the /unfollow route.
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {

                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } }) //dispatching the updated following and followers array payload to the userReducer.js
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {//setting the state when user unfollowed some other user
                    const newFollower = prevState.user.followers.filter(item => item !== data._id) //creating a newfollower array which contain the id of all the follower except the who is unfollowing the current user
                    return {
                        //as every entry is either object or array, we have to use spread operator repeatedly to merge states
                        ...prevState, //spreading the previous state
                        user: {
                            ...prevState.user, //spreading the previous state.user
                            followers: newFollower //setting the followers array as the newFollower array
                        }
                    }
                })
                setShowFollow(true)
            })

    }



    return (
        <>
            { userProfile ? //if userProfile exists then below whole code will implement


                <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={userProfile.user.pic}
                            />
                        </div>
                        <div>
                            {/* //dynamically passing the user name and user email using state option only if it exists */}
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                {/* //dynamically showing number of posts posted by the user  */}
                                <h6>{userProfile.posts.length} Posts</h6>
                                {/* //dynamically setting the followers and following array in profile */}
                                <h6>{userProfile.user.followers.length} Followers</h6>
                                <h6>{userProfile.user.following.length} Following</h6>
                            </div>
                            {showfollow ? //if showfollow is false, then we will see the follow button
                                <button style={{ margin: "10px" }} className="btn waves-effect waves-light" onClick={() => followUser()}>Follow</button>
                                : //and if showfollow is true, then we will see the unfollow button
                                <button style={{ margin: "10px" }} className="btn waves-effect waves-light" onClick={() => unfollowUser()}>Unfollow</button>
                            }
                        </div>
                    </div>

                    <div className="gallery">
                        {
                            userProfile.posts.map(item => { //using map method to dynamically assign properties to each element, item refres to data and data refers to reult.mypost array that contain all info about posts
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title}></img>
                                )
                            })
                        }

                    </div>
                </div>

                //if userProfile does not exists then below  code will implement showing Loding
                : <h2>Loading Profile</h2>}

        </>
    )
}

export default Profile
