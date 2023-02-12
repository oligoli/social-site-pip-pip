import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setpics] = useState([]);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const { state, dispatch } = useContext(UserContext);
  console.log("state", state);

  useEffect(() => {
    fetch("https://fast-harbor-14116.herokuapp.com/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => setpics(result.mypost));
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone-21");
      data.append("cloud_name", "dliu4iryp");
      fetch("https://api.cloudinary.com/v1_1/dliu4iryp/image/upload", {
        method: "post",
        mode: "cors",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("https://fast-harbor-14116.herokuapp.com/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );

              // window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    console.log("okk");
    setImage(file);
  };
  return (
    <div
      style={{
        maxWidth: "560px",
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
            src={state ? state.pic : "loading.."}
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            alt="person"
          />
          <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
              <span>Update image </span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input class="file-path validate" type="text" />
            </div>
          </div>
        </div>

        <div>
          <h4>{state ? state.name : "loading.."}</h4>
          <h5>{state ? state.email : "loading.."}</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "120%",
            }}
          >
            <h5>{mypics.length}posts</h5>
            <h5> {state ? state.followers.length : 0} flowers</h5>
            <h5>{state ? state.following.length : 0} following</h5>
          </div>
        </div>
      </div>
      <div>
        <div className="gallery">
          {mypics.map((item) => {
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
  );
};

export default Profile;
