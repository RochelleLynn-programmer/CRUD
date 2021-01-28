import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosPath from "../../axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Paper, Typography, Container, Button } from "@material-ui/core";

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

export const UpdateDataImgForm = ({
  first,
  last,
  email,
  description,
  originalName,
  _id,
  filename,
  fileId,
  update,
  setUpdate,
}) => {
  const classes = useStyles();
  const [image, setImage] = useState("");
  const [updateFirst, setUpdateFirst] = useState(first);
  const [updateLast, setUpdateLast] = useState(last);
  const [updateEmail, setUpdateEmail] = useState(email);
  const [updateDescription, setUpdateDescription] = useState(description);
  // const [updateOriginalName, setUpdateOriginalName] = useState(originalName);
  const { register, handleSubmit } = useForm();

  const stepOne = async (filename) => {
    try {
      await axiosPath.delete(`/deletepic/${filename}`);
    } catch (err) {
      console.log("Error ImageForm line 13: ", err);
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
          console.log("filename: ", res.data.filename);
          console.log("fileId: ", res.data.fileId);
          newFilename = res.data.filename;
          newFileId = res.data.fileId;
          newOriginalName = res.data.originalName;
        });
      await axiosPath.patch(`/updateBoth/${_id}`, {
        filename: newFilename,
        fileId: newFileId,
        originalName: newOriginalName,
        first: updateFirst,
        last: updateLast,
        email: updateEmail,
        description: updateDescription,
      });
    } catch (err) {
      console.log("Error ImageForm line 33: ", err);
    }
  };

  const onSubmit = async () => {
    try {
      console.log("entering submit");
      await stepOne(filename);
      console.log("done step one");
      await stepTwo();
      console.log("done step 2");
      setUpdate(update + 1);
    } catch (err) {
      console.log("Error ImageForm line 42: ", err);
    }
  };

  return (
    <Container className={classes.flex} maxWidth="sm">
      <Paper className={classes.paper}>
        <Typography>Please Update This Submission</Typography>

        <form id="userForm" className={classes.root} autoComplete="off" encType="multipart/form-data">
          <TextField
            id="first"
            name="first"
            value={updateFirst}
            placeholder={first}
            onChange={(e) => setUpdateFirst(e.target.value)}
            ref={register({ required: true, name: "first" })}
            label="First Name"
            type="text"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="last"
            name="last"
            value={updateLast}
            placeholder={last}
            onChange={(e) => setUpdateLast(e.target.value)}
            ref={register({ required: true, name: "last" })}
            label="Last Name"
            type="text"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="email"
            name="email"
            value={updateEmail}
            placeholder={email}
            onChange={(e) => setUpdateEmail(e.target.value)}
            ref={register({ required: true, name: "email" })}
            label="Email Address"
            type="email"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="description"
            name="description"
            value={updateDescription}
            placeholder={description}
            onChange={(e) => setUpdateDescription(e.target.value)}
            ref={register({ required: true, name: "description" })}
            label="Description of Image"
            type="text"
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
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
};
