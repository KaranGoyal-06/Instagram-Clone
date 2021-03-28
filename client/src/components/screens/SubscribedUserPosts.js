import React, { useState, useEffect, useContext } from 'react'
import M from 'materialize-css'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'


function Home() {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
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
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
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
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }


    const makeComment = (text, postId) => {
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
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
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
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
                M.toast({ html: "Post Deleted", classes: "#2e7d32 green darken-3" })
            })
    }






    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>

                            <h5 style={{ padding: "1rem" }}><Link className="name-link" to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : "/profile"}
                            >{item.postedBy.name}</Link>

                                {item.postedBy._id == state._id
                                    && <i className="material-icons" style={{
                                        float: "right"
                                    }}
                                        onClick={() => deletePost(item._id)}
                                    >delete</i>
                                }</h5>
                            <div className="card-image">

                                <img src={item.photo}></img>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>

                                {item.likes.includes(state._id)
                                    ? <i className="material-icons"
                                        onClick={() => { unlikePost(item._id) }}
                                    >thumb_down</i>
                                    : <i className="material-icons"
                                        onClick={() => { likePost(item._id) }}
                                    >thumb_up</i>}



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
                                    makeComment(e.target[0].value, item._id)
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
