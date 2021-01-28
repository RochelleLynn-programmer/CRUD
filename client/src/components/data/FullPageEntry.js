import React, { useState, useEffect } from "react";
import axiosPath from "../../axios";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CameraAltSharpIcon from "@material-ui/icons/CameraAltSharp";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import "./data.css";
import { UpdateDataForm } from "../forms/UpdateDataForm";
import UpdateImgForm from "../forms/UpdateImgForm";
import { UpdateDataImgForm } from "../forms/UpdateDataImgForm";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "80%",
  },
  box: {
    margin: "auto",
    maxWidth: "80%",
    paddingTop: "30px",
    paddingLeft: "30px",
    paddingRight: "30px",
  },
  media: {
    height: "400px",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  gridContainer: {
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
    display: "flex",
    justifyContent: "center",
    minWidth: "60%",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function FullPageEntry({ match }) {
  const classes = useStyles();
  const [submission, setSubmission] = useState("");
  const [update, setUpdate] = useState(0);
  const [formOptions, setFormOptions] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (option) => {
    setFormOptions(option);
    setAnchorEl(null);
  };

  useEffect(() => {
    axiosPath
      .get(`/oneprofile/${match.params.id}`)
      .then((res) => {
        // console.log("res in useEffect: ", res);
        setSubmission(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [match.params.id, update]);
  let updateFormChoice;

  if (submission) {
    const email = submission[0].email;
    const first = submission[0].first;
    const last = submission[0].last;
    const fileId = submission[0].fileId;
    const filename = submission[0].filename;
    const _id = submission[0]._id;
    const description = submission[0].description;
    const originalName = submission[0].originalName;

    if (formOptions === "info") {
      updateFormChoice = (
        <UpdateDataForm
          _id={_id}
          first={first}
          last={last}
          email={email}
          description={description}
          originalName={originalName}
          update={update}
          setUpdate={setUpdate}
        />
      );
    } else if (formOptions === "image") {
      updateFormChoice = (
        <UpdateImgForm filename={filename} fileId={fileId} _id={_id} update={update} setUpdate={setUpdate} />
      );
    } else if (formOptions === "both") {
      updateFormChoice = (
        <UpdateDataImgForm
          first={first}
          last={last}
          email={email}
          description={description}
          originalName={originalName}
          _id={_id}
          filename={filename}
          fileId={fileId}
          update={update}
          setUpdate={setUpdate}
        />
      );
    }
    return (
      <div className={classes.box}>
        <Card>
          <CardHeader
            avatar={<CameraAltSharpIcon />}
            action={
              <>
                <IconButton aria-label="update options" onClick={handleMenu}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => handleMenuClick(null)}>Update Nothing</MenuItem>
                  <MenuItem onClick={() => handleMenuClick("info")}>Update Information</MenuItem>
                  <MenuItem onClick={() => handleMenuClick("image")}>Update Image</MenuItem>
                  <MenuItem onClick={() => handleMenuClick("both")}>Update Info and Image</MenuItem>
                </Menu>
              </>
            }
            title={originalName}
            subheader={description}
          />
          <CardMedia
            component="img"
            className={classes.media}
            image={`http://localhost:4000/profile/${filename}`}
            title={originalName}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              Photo submitted by: {first} {last}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Contact: {email}
            </Typography>
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>
        {updateFormChoice}
      </div>
    );
  } else {
    return <div>Loading....</div>;
  }
}
