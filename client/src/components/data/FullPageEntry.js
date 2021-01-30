import React, { useState, useEffect } from "react";
import axiosPath from "../../axios";
import {
  Card,
  makeStyles,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  Popover,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CameraAltSharpIcon from "@material-ui/icons/CameraAltSharp";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import KeyboardReturnTwoToneIcon from "@material-ui/icons/KeyboardReturnTwoTone";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import "./data.css";
import { UpdateDataForm } from "../forms/UpdateDataForm";
import UpdateImgForm from "../forms/UpdateImgForm";
import { UpdateDataImgForm } from "../forms/UpdateDataImgForm";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "80%",
  },
  headerStyle: {
    background: "aliceblue",
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
  popUpHeader: {
    background: "aliceblue",
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
  },
  popover: {
    pointerEvents: "none",
  },
  cancelButton: {
    position: "absolute",
    marginRight: "5px",
  },
}));

export default function FullPageEntry({ match }) {
  const classes = useStyles();
  const [submission, setSubmission] = useState("");
  const [update, setUpdate] = useState(0);
  const [formOptions, setFormOptions] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [anchorElHover, setAnchorElHover] = useState(null);
  const open = Boolean(anchorEl);
  const openHover = Boolean(anchorElHover);
  const handlePopoverOpen = (event) => {
    setAnchorElHover(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorElHover(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (option) => {
    setFormOptions(option);
    setOpenPopUp(true);
    setAnchorEl(null);
  };

  useEffect(() => {
    axiosPath
      .get(`/oneprofile/${match.params.id}`)
      .then((res) => {
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
    const number = submission[0].number;
    const _id = submission[0]._id;
    const description = submission[0].description;
    const originalName = submission[0].originalName;
    let subHeaderText = `Number for calculations: ${number}`;
    let formPopupHeader;

    if (formOptions === "info") {
      formPopupHeader = "Please Update the FormFields";
      updateFormChoice = (
        <UpdateDataForm
          _id={_id}
          first={first}
          last={last}
          email={email}
          description={description}
          originalName={originalName}
          number={number}
          update={update}
          setUpdate={setUpdate}
          openPopUp={openPopUp}
          setOpenPopUp={setOpenPopUp}
        />
      );
    } else if (formOptions === "image") {
      formPopupHeader = "Please Update the Image";
      updateFormChoice = (
        <UpdateImgForm
          filename={filename}
          fileId={fileId}
          _id={_id}
          update={update}
          setUpdate={setUpdate}
          openPopUp={openPopUp}
          setOpenPopUp={setOpenPopUp}
        />
      );
    } else if (formOptions === "both") {
      formPopupHeader = "Please Update the FormFields and Image";
      updateFormChoice = (
        <UpdateDataImgForm
          first={first}
          last={last}
          email={email}
          description={description}
          originalName={originalName}
          number={number}
          _id={_id}
          filename={filename}
          fileId={fileId}
          update={update}
          setUpdate={setUpdate}
          openPopUp={openPopUp}
          setOpenPopUp={setOpenPopUp}
        />
      );
    }
    return (
      <div className={classes.box}>
        <Card>
          <CardHeader
            className={classes.headerStyle}
            avatar={<CameraAltSharpIcon />}
            action={
              <>
                <Link to={`/display`}>
                  <IconButton>
                    <KeyboardReturnTwoToneIcon
                      aria-owns={open ? "mouse-over-popover-back" : undefined}
                      aria-haspopup="true"
                      onMouseEnter={handlePopoverOpen}
                      onMouseLeave={handlePopoverClose}
                    />
                  </IconButton>
                </Link>
                <Popover
                  id="mouse-over-popover-delete"
                  className={classes.popover}
                  classes={{
                    paper: classes.paper,
                  }}
                  open={openHover}
                  anchorEl={anchorElHover}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <Typography>Go back</Typography>
                </Popover>
                <IconButton aria-label="update options" onClick={handleMenu}>
                  <EditTwoToneIcon />
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
            subheader={subHeaderText}
          />
          <CardMedia
            component="img"
            className={classes.media}
            image={`http://localhost:4000/profile/${filename}`}
            title={originalName}
          />
          <CardContent>
            <Typography align="center" variant="body2" color="textSecondary" component="p">
              Description submitted by user: {description}
            </Typography>
            <Typography align="center" variant="body2" color="textSecondary" component="p">
              Photo submitted by: {first} {last}
            </Typography>
            <Typography align="center" variant="body2" color="textSecondary" component="p">
              Contact: {email}
            </Typography>
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>
        <Dialog open={openPopUp} className={classes.dialogBox}>
          <DialogTitle className={classes.popUpHeader}>
            <div className={classes.flex}>
              <Typography variant="h6">{formPopupHeader}</Typography>

              <IconButton onClick={() => setOpenPopUp(false)}>
                <CancelTwoToneIcon className={classes.cancelButton} />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent dividers className="dialogContent">
            {updateFormChoice}
          </DialogContent>
        </Dialog>
      </div>
    );
  } else {
    return <div>Loading....</div>;
  }
}
