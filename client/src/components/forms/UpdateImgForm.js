import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosPath from "../../axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Paper, Container, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      display: "flex",
      justifyContent: "center",
      margin: theme.spacing(1),
    },
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: theme.spacing(8),
    padding: theme.spacing(2),
  },
  flex: { display: "flex", justifyContent: "center", alignItems: "center" },
}));

export default function UpdateImgForm({ filename, fileId, _id, update, setUpdate, setOpenPopUp }) {
  const classes = useStyles();
  const [image, setImage] = useState("");
  const { register, handleSubmit } = useForm();

  const stepOne = async (filename) => {
    try {
      await axiosPath.delete(`/deletepic/${filename}`);
    } catch (err) {
      console.log("Error on line 35 UpdateImgForm.js: ", err);
    }
  };

  const stepTwo = async () => {
    let newFilename;
    let newFileId;
    let newOriginalName;
    try {
      const newPhoto = new FormData();
      newPhoto.append("photo", image);
      await axiosPath
        .post("/uploadPic", newPhoto, { headers: { "Content-Type": "multipart/form-data" } })
        .then((res) => {
          newFilename = res.data.filename;
          newFileId = res.data.fileId;
          newOriginalName = res.data.originalName;
        });
      await axiosPath.patch(`/updatePic/${_id}`, {
        filename: newFilename,
        fileId: newFileId,
        originalName: newOriginalName,
      });
    } catch (err) {
      console.log("Error on line 59 UpdateImgForm.js: ", err);
    }
  };

  const onSubmit = async () => {
    try {
      await stepOne(filename);
      await stepTwo();
      setUpdate(update + 1);
    } catch (err) {
      console.log("Error on line 69 UpdateImgForm.js: ", err);
    }
    setOpenPopUp(false);
  };
  return (
    <Container className={classes.flex} maxWidth="sm">
      <Paper className={classes.paper}>
        <form id="userForm" className={classes.root} autoComplete="off" encType="multipart/form-data">
          <TextField
            id="photo"
            type="file"
            name="photo"
            onChange={(e) => setImage(e.target.files[0])}
            ref={register({ required: true, name: "photo" })}
            helperText="Select an Image"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button variant="contained" type="submit" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
