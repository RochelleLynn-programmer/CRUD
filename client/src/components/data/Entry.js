import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import InfoTwoToneIcon from "@material-ui/icons/InfoTwoTone";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import axiosPath from "../../axios";
import Popover from "@material-ui/core/Popover";
import "./data.css";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: 300,
    marginBottom: "0px",
    paddingBottom: "0px",
  },
  media: {
    marginTop: "5px",
    height: 170,
    width: "75%",
    border: "solid 1px black",
    margin: "auto",
  },
  select: {
    display: "flex",
    marginBottom: 0,
    paddingBottom: 0,
  },
  action: { border: "solid 1px black", display: "flex", alignContent: "flex-end", marginBottom: 0, paddingBottom: 0 },
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
  index,
  update,
  setUpdate,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
      <IconButton size="small" color="secondary" onClick={() => handleDelete(filename, _id)}>
        <HighlightOffTwoToneIcon
          aria-owns={open ? "mouse-over-popover-delete" : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        />
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
      </IconButton>
      <CardMedia
        className={classes.media}
        component="img"
        alt={originalName}
        image={`http://localhost:4000/profile/${filename}`}
        title="Contemplative Reptile"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          {originalName}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>

      <CardActions disableSpacing={true} className={classes.action}>
        <Link to={`/entry/${_id}`}>
          <IconButton size="small" color="primary">
            <InfoTwoToneIcon
              aria-owns={open ? "mouse-over-popover-info" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            />
            <Popover
              id="mouse-over-popover-info"
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
              <Typography>More Information and Edit</Typography>
            </Popover>
          </IconButton>
        </Link>

        <IconButton size="small" color="primary">
          <FavoriteBorderTwoToneIcon
            aria-owns={open ? "mouse-over-popover-add" : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
          <Popover
            id="mouse-over-popover-add"
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
            <Typography>Button will eventually add item to a list</Typography>
          </Popover>
        </IconButton>
      </CardActions>
    </Card>
  );
};
