import React, { useState } from "react";
import axiosPath from "../../axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Paper, Container, Button, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  setOpenPopUp,
}) => {
  const classes = useStyles();
  const [image, setImage] = useState("");
  const [updateFirst, setUpdateFirst] = useState(first);
  const [updateLast, setUpdateLast] = useState(last);
  const [updateEmail, setUpdateEmail] = useState(email);
  const [updateDescription, setUpdateDescription] = useState(description);
  const [openErrMessage, setOpenErrMessage] = useState(false);
  const [emailErr, setEmailErr] = useState(false);

  let newFilename;
  let newFileId;
  let newOriginalName;

  const stepOne = async (filename) => {
    // console.log("entered stepOne func");
    try {
      await axiosPath.delete(`/deletepic/${filename}`);
    } catch (err) {
      console.log("Error on line 53 UpdateDataImgForm.js: ", err);
    }
  };

  const stepTwo = async () => {
    // console.log("entered steptwo func");
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
    } catch (err) {
      console.log("Error on line 78 UpdateDataImgForm.js: ", err);
    }
  };

  const stepThree = async () => {
    try {
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
      console.log("Error on line 94 in UpdateDataImgForm.js: ", err);
    }
  };

  const checkEmail = (checkInput) => {
    // console.log("entering check email");
    const emailTester = new RegExp(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim);
    const result = emailTester.test(checkInput);
    // console.log("regex result: ", result);
    if (result) {
      // console.log("entering if block of checkEmail");
      setEmailErr(false);
      return true;
    } else setEmailErr(true);
  };

  const onPassTests = async () => {
    // console.log("entered onpassTests func");
    try {
      await stepOne(filename);
      await stepTwo();
      await stepThree();
      setUpdate(update + 1);
    } catch (err) {
      console.log("Error on line 118 in UpdateDataImgForm.js: ", err);
    }
    setOpenPopUp(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrMessage(false);
  };

  const checkState = async () => {
    // console.log("Entered checkstate func");
    if (updateFirst && updateLast && updateEmail && updateDescription && image) {
      return true;
    } else {
      setOpenErrMessage(true);
    }
  };

  const onSubmit = async () => {
    if (checkEmail(updateEmail)) {
      if (checkState) {
        await onPassTests();
      }
    } else setOpenErrMessage(true);
  };

  return (
    <Container className={classes.flex} maxWidth="sm">
      <Paper className={classes.paper}>
        <form id="updateDataImgForm" className={classes.root} autoComplete="off" encType="multipart/form-data">
          <TextField
            required
            label="First Name"
            id="first"
            name="first"
            value={updateFirst}
            onChange={(e) => setUpdateFirst(e.target.value)}
            error={!updateFirst}
            type="text"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={first}
          />
          <TextField
            required
            label="Last Name"
            id="last"
            name="last"
            value={updateLast}
            onChange={(e) => setUpdateLast(e.target.value)}
            error={!updateLast}
            type="text"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={last}
          />
          <TextField
            required
            label="Email Address"
            id="email"
            name="email"
            value={updateEmail}
            onChange={(e) => setUpdateEmail(e.target.value)}
            error={!updateEmail || emailErr}
            type="email"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={email}
          />

          <TextField
            required
            label="Description of Image"
            id="description"
            name="description"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            error={!updateDescription}
            type="text"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={description}
            multiline
          />
          <TextField
            required
            helperText="Select an Image"
            id="photo"
            type="file"
            name="photo"
            onChange={(e) => setImage(e.target.files[0])}
            error={!image}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
          <Snackbar open={openErrMessage} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              Please make sure all fields have a value
            </Alert>
          </Snackbar>
        </form>
      </Paper>
    </Container>
  );
};
