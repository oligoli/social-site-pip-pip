import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import "./Navbar.css";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/create">Create Post</Link>
        </li>,
        <li>
          <Link to="/myfollowingspost">My following</Link>
        </li>,
        <li>
          <button
            className="btn #c62828 red darken-3"
            type="submit"
            name="action"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          {" "}
          <Link to="/login">Login</Link>
        </li>,
        <li>
          {" "}
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link
          style={{ marginLeft: "2%" }}
          to={state ? "/" : "/login"}
          className="brand-logo left"
        >
          Pip-piP
        </Link>
        <ul id="nav-mobile" className="right ">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
