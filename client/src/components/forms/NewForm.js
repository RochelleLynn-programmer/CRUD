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

export const NewForm = () => {
  const classes = useStyles();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [number, setNumber] = useState(0);
  const [image, setImage] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async () => {
    const uploadedForm = new FormData();
    uploadedForm.append("first", first);
    uploadedForm.append("last", last);
    uploadedForm.append("email", email);
    uploadedForm.append("description", description);
    uploadedForm.append("photo", image);
    uploadedForm.append("number", number);

    try {
      await axiosPath.post("/uploadForm", uploadedForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFirst("");
      setLast("");
      setEmail("");
      setDescription("");
      setNumber(0);
      setImage("");
    } catch (err) {
      console.log("Error NewForm line 56: ", err);
    }
  };
  return (
    <Container className={classes.flex} maxWidth="sm">
      <Paper className={classes.paper}>
        <Typography>Please Make Your Submission</Typography>

        <form id="userForm" className={classes.root} autoComplete="off" encType="multipart/form-data">
          <TextField
            id="first"
            name="first"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
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
            value={last}
            onChange={(e) => setLast(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            ref={register({ required: true, name: "description" })}
            label="Description of Image"
            type="text"
            multiline
            placeholder="A short description about the image submitted"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          <TextField
            id="number"
            name="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            ref={register({ required: true, name: "number" })}
            label="Number to do calculations"
            type="number"
            placeholder="Number to do calculations "
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
