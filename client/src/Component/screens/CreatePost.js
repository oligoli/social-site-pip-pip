import M from "materialize-css";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("http://localhost:4000/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#f44336 red darken-3" });
          } else {
            M.toast({
              html: "created post successfully",
              classes: "#004d40 teal darken-4",
            });
            history.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [url]);

  const postDetails = () => {
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
        console.log(data);
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="card input-field"
      style={{
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        id="textarea1 multiliner"
        name="multiliner"
        class="materialize-textarea"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></textarea>

      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>UPLOAD IMAGE</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input class="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-1"
        type="submit"
        name="action"
        onClick={() => postDetails()}
      >
        Submit post
      </button>
    </div>
  );
};

export default CreatePost;
