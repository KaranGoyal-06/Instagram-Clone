import React, { useState, useEffect, useContext } from 'react'
import M from 'materialize-css'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'


function Home() { //function for dynamically creating posts
    const [data, setData] = useState([]) //hook for setting post data in an array
    const { state, dispatch } = useContext(UserContext) //state has all the details of the user who is logged in

    useEffect(() => {
        fetch('/getsubpost', { //get request for fetching data stored in database regarding all the posts using /allpost route in post.js in server
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt") //passing token as user can only create post when signed in
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setData(result.posts) //setting data to the obtatined array of result.posts containing info about all the posts
            })
    }, [])

    const likePost = (id) => { //passing the post id to the /like route in the backend by sending a put request
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.map(item => {//function for updating like state
                    if (item._id === result._id) {
                        return result //if both the id's are equal will return the updated record
                    } else {
                        return item //otherwise will return the old record
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }


    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.map(item => {//function for updating like state
                    if (item._id === result._id) {
                        return result //if both the id's are equal will return the updated record
                    } else {
                        return item //otherwise will return the old record
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }


    const makeComment = (text, postId) => { //function for passing the post id and text to the /comment route in the backend by sending a put request
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {//function for updating comment state
                    if (item._id === result._id) {
                        return result //if both the id's are equal will return the updated record
                    } else {
                        return item //otherwise will return the old record
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }


    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: 'delete',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.filter(item => { //filtering out every item or post 
                    return item._id !== result._id //in this filter will return all the items whose id is not equal to id of the post to be deleted i.e will exclude the one post to be deleted and will show rest of the posts hence delete functionality implemented 
                })
                setData(newData)//will set the data as the new filtered out array of the posts 
                M.toast({ html: "Post Deleted", classes: "#2e7d32 green darken-3" })
            })
    }






    return (
        <div className="home">
            {
                data.map(item => { //using map method to dynamically assign properties to each element, item refres to data and data refers to reult.posts array that contain all info about posts
                    return (
                        <div className="card home-card" key={item._id}>
                            {/* //in the below line is the very important logic to dynamically view other user's profile
                            if the logged in user clicks on the other user's  name then he will redirect to other user's profile
                            and if the logged in user clicks on his name than he will redirect to his profile */}
                            <h5 style={{ padding: "1rem" }}><Link className="name-link" to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : "/profile"}
                            >{item.postedBy.name}</Link> {/* dynamically passing name of the user who created the post */}

                                {item.postedBy._id == state._id //logic for showing delete post icon to only to the user who created it, 
                                    && <i className="material-icons" style={{ //delete icon will show if the logic is true
                                        float: "right"
                                    }}
                                        onClick={() => deletePost(item._id)} //implementing the onclick functionality on delete icon, it will refer to deletePost function and will also pass _id
                                    >delete</i>
                                }</h5>
                            <div className="card-image">
                                {/* dynamically passing photo url of the photo uploaded by the user who created the post */}
                                <img src={item.photo}></img>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {/* //in the line below adding css materialize icons for like and unlike */}
                                {item.likes.includes(state._id) //in this we are adding a logic to not to show like icon to the user who has already liked a post and unlike icon and unlike icon to user who has already disliked the post
                                    ? <i className="material-icons" //so in this if likes array contain the user id that means user has already liked the post, so they will only be shown the dislike icon
                                        onClick={() => { unlikePost(item._id) }}
                                    >thumb_down</i>
                                    : <i className="material-icons" //and in this if likes array  not contain the user id that means user has not liked the post, so they will only be shown the like icon
                                        onClick={() => { likePost(item._id) }}
                                    >thumb_up</i>}


                                {/* //dynamically passing the number of likes, by the length of likes array that is present in every item */}
                                <h6 className="post-likes">{item.likes.length} Likes</h6>
                                {/* dynamically passing title and body of the post created by the user */}
                                <h6 className="post-title">{item.title}</h6>
                                <p className="post-body">{item.body}</p>

                                {/* //logic for dynamically showing comments on the post */}
                                <div style={{ marginBottom: "1.5rem" }}>
                                    {
                                        item.comments.map(record => { //mapping the comments array in the item
                                            return (

                                                < h6 style={{ fontWeight: "500", fontSize: "1.5rem", marginTop: "1rem" }} key={record._id} ><span style={{ fontWeight: "500", fontSize: "1.75rem" }}> <Link to={record.postedBy._id !== state._id ? `/profile/${record.postedBy._id}` : "/profile"}>{record.postedBy.name} </Link>- </span>{record.text} </h6>//this will return everytime a cooment is made, the comment text and user's name will be shown on the screen
                                            )
                                        })
                                    }
                                </div>
                                {/* //in the line below we are creating logic for dynamically post comments */}
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id) //on submit of the we will pass two values text and id, e.target[0].value refers to the comment posted by the user and item._id refers to the id
                                    e.target[0].value = ""
                                }}>
                                    <input style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }} type="text" placeholder="Add a comment" />
                                    <button className="btn commentbtn" type="submit" name="action" style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0rem", paddingBottom: "1.5rem" }}>
                                        <i style={{ fontSize: "1.75rem" }} className="material-icons">send</i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    )
                })
            }


        </div >
    )
}

export default Home
