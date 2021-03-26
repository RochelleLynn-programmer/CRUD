import React, { useState } from "react";
import axiosPath from "../../axios";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Container, Button, Snackbar, TextField } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="outlined" {...props} />;
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
    margin: theme.spacing(4),
  },
  flex: { display: "flex", justifyContent: "center", alignItems: "center" },
  header: {
    background: "aliceblue",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
}));

export const NewForm = () => {
  const classes = useStyles();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [failedEmailTest, setFailedEmailTest] = useState(false);
  const [firstErr, setFirstErr] = useState(false);
  const [lastErr, setLastErr] = useState(false);
  const [descErr, setDescErr] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const emailTester = new RegExp(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/);

  const setErrorHighlight = () => {
    console.log("entered set error highlight");
    if (!first) {
      setFirstErr(true);
    } else setFirstErr(false);
    if (!last) {
      setLastErr(true);
    } else setLastErr(false);
    if (failedEmailTest || !email) {
      setEmailErr(true);
      console.log("email err 66: ", emailErr);
    } else {
      setEmailErr(false);
      console.log("email err 69: ", emailErr);
    }
    if (!description) {
      setDescErr(true);
    } else setDescErr(false);
    if (!image) {
      setImgErr(true);
    } else setImgErr(false);
    console.log("done set error highlight");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const checkEmail = (checkInput) => {
    console.log("entered checkEmail func");
    const result = emailTester.test(checkInput);
    console.log("result from regex: ", result);
    if (result) {
      setFailedEmailTest(false);
      return true;
    } else setFailedEmailTest(true);
  };

  const onSubmit = async () => {
    console.log("entered onSubmit func");
    const uploadedForm = new FormData();
    uploadedForm.append("first", first);
    uploadedForm.append("last", last);
    uploadedForm.append("email", email);
    uploadedForm.append("description", description);
    uploadedForm.append("photo", image);

    try {
      await axiosPath.post("/uploadForm", uploadedForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFirst("");
      setLast("");
      setEmail("");
      setDescription("");
      setImage("");
      setFirstErr(false);
      setLastErr(false);
      setEmailErr(false);
      setDescErr(false);
      setImgErr(false);
    } catch (err) {
      console.log("Error NewForm line 127: ", err);
    }
  };

  const checkState = async () => {
    console.log("entered checkState func");
    if (checkEmail(email)) {
      console.log("passed email check");
      if (first && last && email && description && image) {
        console.log("passed state check");
        setSubmitted(true);
        await onSubmit();
        setTimeout(() => {
          setSubmitted(false);
        }, 1500);
        return;
      }
    } else setErrorHighlight();
    setOpen(true);
  };
  return (
    <>
      <Container className={classes.flex}>
        <Paper className={classes.paper}>
          <div className={classes.header}>
            <Typography>Please make your submission</Typography>
          </div>
          <form id="userForm" className={classes.root} autoComplete="off" encType="multipart/form-data">
            <TextField
              required
              label="First Name"
              id="first"
              name="first"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              error={firstErr}
              type="text"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              required
              label="Last Name"
              id="last"
              name="last"
              value={last}
              onChange={(e) => setLast(e.target.value)}
              error={lastErr}
              type="text"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              required
              label="Email Address"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailErr}
              type="email"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              required
              label="Description of Image"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={descErr}
              type="text"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="A short description about the image submitted"
              multiline
            />
            <TextField
              required
              helperText="Select an Image"
              id="photo"
              type="file"
              name="photo"
              onChange={(e) => setImage(e.target.files[0])}
              error={imgErr}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button variant="contained" onClick={checkState} disabled={submitted}>
              {(submitted && "Your Form is Submitting") || (!submitted && "Submit")}
            </Button>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Please fill out the entire form
              </Alert>
            </Snackbar>
          </form>
        </Paper>
      </Container>
    </>
  );
};
