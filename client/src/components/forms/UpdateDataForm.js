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

export const UpdateDataForm = ({
  first,
  last,
  email,
  description,
  originalName,
  _id,
  number,
  update,
  setUpdate,
  setOpenPopUp,
}) => {
  const classes = useStyles();
  const [updateFirst, setUpdateFirst] = useState(first);
  const [updateLast, setUpdateLast] = useState(last);
  const [updateEmail, setUpdateEmail] = useState(email);
  const [updateDescription, setUpdateDescription] = useState(description);
  const [updateOriginalName, setUpdateOriginalName] = useState(originalName);
  const [errorM, setErrorM] = useState(false);
  const [emailErr, setEmailErr] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorM(false);
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

  const checkState = () => {
    // console.log("entering check state");
    if (updateFirst && updateLast && updateEmail && updateDescription) {
      // console.log("passed stateCheck");
      return true;
    } else setErrorM(true);
  };

  const onPassTests = async () => {
    const body = {
      first: updateFirst,
      last: updateLast,
      email: updateEmail,
      description: updateDescription,
      originalName: updateOriginalName,
    };
    try {
      await axiosPath.patch(`/updateData/${_id}`, body, {
        headers: { "Content-Type": "application/json" },
      });
      setUpdate(update + 1);
      console.log("update num: ", update);
    } catch (err) {
      console.log("Error on line 93 UpdateDataForm.js: ", err);
    }
    setOpenPopUp(false);
  };
  const onSubmit = async () => {
    if (checkEmail(updateEmail)) {
      if (checkState()) {
        await onPassTests();
      } else setErrorM(true);
    } else setErrorM(true);
  };
  return (
    <Container className={classes.flex}>
      <Paper className={classes.paper}>
        <form id="dataForm" className={classes.root} autoComplete="off">
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
            label="originalName of Image"
            id="originalName"
            name="originalName"
            value={updateOriginalName}
            onChange={(e) => setUpdateOriginalName(e.target.value)}
            error={!updateOriginalName}
            type="text"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={originalName}
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

          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
          <Snackbar open={errorM} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              Please make sure all fields are correctly filled out
            </Alert>
          </Snackbar>
        </form>
      </Paper>
    </Container>
  );
};
