import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { UserContext } from "../../App";

const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);
  const [followers, setfollowers] = useState(0);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`https://fast-harbor-14116.herokuapp.com/profile/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfile(result);
        setfollowers(result.user.followers.length);
      });
  }, []);
  console.log(userProfile);
  const followUser = () => {
    setfollowers(followers + 1);
    setShowFollow(false);
    fetch("https://fast-harbor-14116.herokuapp.com/follow", {
      method: "put",
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: data.following,
            followers: data.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
        console.log(data);
      });
  };

  const unFollowUser = () => {
    setfollowers(followers - 1);
    setShowFollow(true);
    fetch("https://fast-harbor-14116.herokuapp.com/unfollow", {
      method: "put",
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unFollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: data.following,
            followers: data.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
        console.log(data);
      });
  };

  return (
    <>
      {userProfile ? (
        <div
          style={{
            maxWidth: "550px",
            margin: "0px auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0%",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                src={userProfile.user.pic}
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                alt="person"
              />
            </div>

            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h5>{userProfile.posts.length} posts</h5>
                <h5>{followers} flowers</h5>
                <h5>{userProfile.user.following.length} following</h5>
              </div>
              {showFollow ? (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  type="submit"
                  name="action"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  type="submit"
                  name="action"
                  onClick={() => unFollowUser()}
                >
                  Un follow
                </button>
              )}
            </div>
          </div>
          <div>
            <div className="gallery">
              {userProfile.posts.map((item) => {
                return (
                  <img
                    className="item"
                    key={item._id}
                    src={item.photo}
                    alt={item.title}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <h2>Loading.....</h2>
      )}
    </>
  );
};

export default UserProfile;
