import React, { useEffect, createContext, useReducer, useContext } from 'react'
import Navbar from './components/Navbar';
import './App.css'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home';
import Signup from './components/screens/Signup';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'
import { reducer, initialState } from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) //accessing the user details that are available when user is logged in and prsing them from JSON to javascript objects
    if (user) { //if the user is not empty i.e he is logged in then 
      dispatch({ type: "USER", payload: user })

    } else { // and if user is not logged in then push him to sign in page
      history.push('/signin')
    }
  }, []) //we want this routing function to be implemented only once i.e on mounting that's why we are passing an empty array 

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/signin">
        <Login />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState) //destructuring useReducer hook by passing in reducer and initial state and getting state and dispatch in return
  return (
    <UserContext.Provider value={{ state: state, dispatch: dispatch }}>
      {/* // every component should be wrapped under the browser router to access different routes */}
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter >
    </UserContext.Provider>
  );
}

export default App;
