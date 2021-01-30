import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  makeStyles,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Popover,
} from "@material-ui/core";
import InfoTwoToneIcon from "@material-ui/icons/InfoTwoTone";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import axiosPath from "../../axios";
import "./data.css";

const useStyles = makeStyles({
  root: {
    width: 300,
    marginBottom: "0px",
    paddingBottom: "0px",
    background: "ghostwhite",
  },
  media: {
    marginTop: "5px",
    height: 170,
    width: "90%",
    margin: "auto",
  },
  select: {
    display: "flex",
    marginBottom: 0,
    paddingBottom: 0,
  },
  action: {
    background: "aliceblue",
    display: "flex",
    alignContent: "flex-end",
    justifyContent: "space-between",
    marginBottom: 0,
    paddingBottom: 0,
  },
  popover: {
    pointerEvents: "none",
  },
});

export const Entry = ({
  first,
  last,
  email,
  fileId,
  filename,
  _id,
  description,
  originalName,
  number,
  index,
  update,
  setUpdate,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handlePopoverOpen2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handlePopoverClose2 = () => {
    setAnchorEl2(null);
  };
  const handlePopoverOpen3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };
  const handlePopoverClose3 = () => {
    setAnchorEl3(null);
  };
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const open3 = Boolean(anchorEl3);

  const handleDelete = async (filename, _id) => {
    try {
      await axiosPath.delete(`/deleteprofile/${_id}`);
      await axiosPath.delete(`/deletepic/${filename}`);
      setUpdate(update + 1);
    } catch (err) {
      console.log("Error Profiles line 23: ", err);
    }
  };

  return (
    <Card className={classes.root}>
      <CardActions disableSpacing={true} className={classes.action}>
        <>
          <IconButton size="small" color="secondary" onClick={() => handleDelete(filename, _id)}>
            <HighlightOffTwoToneIcon
              aria-owns={open ? "mouse-over-popover-delete" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            />
          </IconButton>
          <Popover
            id="mouse-over-popover-delete"
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={open}
            anchorEl={anchorEl}
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
            <Typography>Delete this Entry</Typography>
          </Popover>
        </>
        <div>
          <Link to={`/entry/${_id}`}>
            <IconButton size="small" color="primary">
              <InfoTwoToneIcon
                aria-owns={open2 ? "mouse-over-popover-info" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen2}
                onMouseLeave={handlePopoverClose2}
              />
            </IconButton>
          </Link>
          <Popover
            id="mouse-over-popover-info"
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={open2}
            anchorEl={anchorEl2}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onClose={handlePopoverClose2}
            disableRestoreFocus
          >
            <Typography>More Information and Edit</Typography>
          </Popover>

          <>
            <IconButton size="small" color="primary">
              <FavoriteBorderTwoToneIcon
                aria-owns={open ? "mouse-over-popover-add" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen3}
                onMouseLeave={handlePopoverClose3}
              />
            </IconButton>
            <Popover
              id="mouse-over-popover-add"
              className={classes.popover}
              classes={{
                paper: classes.paper,
              }}
              open={open3}
              anchorEl={anchorEl3}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose3}
              disableRestoreFocus
            >
              <Typography>Button will eventually add item to a list</Typography>
            </Popover>
          </>
        </div>
      </CardActions>
      <CardMedia
        className={classes.media}
        component="img"
        alt={originalName}
        image={`http://localhost:4000/profile/${filename}`}
        title={originalName}
      />
      <CardContent>
        <Typography variant="subtitle2">Item Name:</Typography>
        <Typography gutterBottom variant="h6" component="h2">
          {originalName.slice(0, 25)}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Number for calculations: {number}
        </Typography>
      </CardContent>
    </Card>
  );
};
