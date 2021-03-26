import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(8),
      padding: theme.spacing(2),
    },
  },
}));

export const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <Typography variant="h6">CRUD Operations</Typography>
        <Typography variant="subtitle1">Stack includes: React, Express, Mongoose, GridFs </Typography>
        <Typography variant="subtitle1">Styling: MaterialUI</Typography>
        <Typography variant="body2">This small app is an example of ability to perform CRUD operations </Typography>
      </Paper>
    </div>
  );
};
