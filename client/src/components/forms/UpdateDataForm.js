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

export const UpdateDataForm = ({ first, last, email, description, originalName, _id, update, setUpdate }) => {
  const classes = useStyles();
  const [updateFirst, setUpdateFirst] = useState(first);
  const [updateLast, setUpdateLast] = useState(last);
  const [updateEmail, setUpdateEmail] = useState(email);
  const [updateDescription, setUpdateDescription] = useState(description);
  const [updateOriginalName, setUpdateOriginalName] = useState(originalName);
  const { register, handleSubmit } = useForm();

  const onSubmit = async () => {
    const body = {
      first: updateFirst,
      last: updateLast,
      email: updateEmail,
      description: updateDescription,
      originalName: updateOriginalName,
    };

    console.log(body);
    try {
      await axiosPath.patch(`/updateData/${_id}`, body, {
        headers: { "Content-Type": "application/json" },
      });
      setUpdate(update + 1);
      console.log("update num: ", update);
    } catch (err) {
      console.log("Error Form line 28: ", err);
    }
  };
  return (
    <Container className={classes.flex} maxWidth="sm">
      <Paper className={classes.paper}>
        <Typography>Update data in this entry</Typography>

        <form id="userForm" className={classes.root} autoComplete="off">
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
            id="originalName"
            name="originalName"
            value={updateOriginalName}
            onChange={(e) => setUpdateOriginalName(e.target.value)}
            ref={register({ required: true, name: "description" })}
            label="originalName of Image"
            type="text"
            multiline
            placeholder={originalName}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />

          <Button variant="contained" type="submit" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
