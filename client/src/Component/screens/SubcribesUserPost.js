import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  "& > *": {
    margin: theme.spacing(1),
    width: "25ch",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  homeCard: {
    maxWidth: "500px",
    height: "maxContent",
    margin: "26px auto",
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function MaterialHome() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //my function start here

  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [pic, setPic] = useState("");
  useEffect(() => {
    fetch("https://fast-harbor-14116.herokuapp.com/getsubpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
        console.log(result);
      });
  }, []);

  const likePost = (id) => {
    fetch("https://fast-harbor-14116.herokuapp.com/like", {
      method: "put",
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(newData);
      })
      .catch((err) => console.log(err));
  };

  const unlikePost = (id) => {
    fetch("https://fast-harbor-14116.herokuapp.com/unlike", {
      method: "put",
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    fetch("https://fast-harbor-14116.herokuapp.com/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = (postid) => {
    fetch(`https://fast-harbor-14116.herokuapp.com/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="home-card">
            <Card className={classes.root} key={item._id}>
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="recipe"
                    src={item.postedBy.pic}
                    className={classes.avatar}
                  ></Avatar>
                }
                action={
                  item.postedBy._id === state._id ? (
                    <IconButton
                      aria-label="settings"
                      onClick={() => deletePost(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    ""
                  )
                }
                title={
                  <Link
                    to={
                      item.postedBy._id === state._id
                        ? "/profile"
                        : "/profile/" + item.postedBy._id
                    }
                  >
                    {item.postedBy.name}
                  </Link>
                }
                subheader="September 14, 2016"
              />
              <CardMedia
                className={classes.media}
                image={item.photo}
                title="photo"
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.postedBy.name}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                {item.likes.includes(state._id) ? (
                  <IconButton
                    aria-label="add to favorites"
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => unlikePost(item._id)}
                  >
                    <FavoriteIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="add to favorites"
                    style={{ cursor: "pointer" }}
                    onClick={() => likePost(item._id)}
                  >
                    <FavoriteIcon />
                  </IconButton>
                )}

                <Typography
                  paragraph
                  style={{
                    marginBottom: "2px",
                    fontWeight: "bold",
                    color: "rgba(0, 0, 0, 0.54)",
                  }}
                >
                  {item.likes.length}Likes
                </Typography>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  {item.comments.map((record) => {
                    return (
                      <div style={{ display: "flex" }}>
                        <Avatar
                          aria-label="recipe"
                          src={record.postedBy.pic}
                          className={classes.avatar}
                        ></Avatar>
                        <div style={{ marginLeft: "2px" }}>
                          <Typography
                            paragraph
                            style={{ fontWeight: "bold", marginTop: "-4px" }}
                          >
                            {record.postedBy.name} :
                          </Typography>
                          <Typography
                            paragraph
                            component="h2"
                            style={{ marginTop: "-14px" }}
                          >
                            {record.text}
                          </Typography>
                        </div>
                      </div>
                    );
                  })}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, item._id);
                      e.target[0].value = "";
                    }}
                  >
                    <input type="text" placeholder="add comment" />
                  </form>
                </CardContent>
              </Collapse>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
