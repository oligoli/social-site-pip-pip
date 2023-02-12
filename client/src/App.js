import React, { createContext, useContext, useEffect, useReducer } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import Navbar from "./Component/Navbar/Navbar";
import { intialState, reducer } from "./Component/reducers/userReducer";
import CreatePost from "./Component/screens/CreatePost";
import Login from "./Component/screens/Login";
import MaterialHome from "./Component/screens/materialHome";
import Profile from "./Component/screens/Profile";
import Signup from "./Component/screens/Signup";
import SubscribesUserPost from "./Component/screens/SubcribesUserPost";
import UserProfile from "./Component/screens/UserProfile";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "user", payload: user });
    } else {
      history.push("/login");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        {/* <Home /> */}
        <MaterialHome />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
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
      <Route path="/myfollowingspost">
        <SubscribesUserPost />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, intialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
