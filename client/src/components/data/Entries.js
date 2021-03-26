import React, { useState, useEffect } from "react";
import axiosPath from "../../axios";
import { Entry } from "./Entry";
import { NewForm } from "../forms";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./data.css";
const useStyles = makeStyles({
  gridContainer: {
    paddingTop: "20px",
    paddingLeft: "15px",
    paddingRight: "15px",
    display: "flex",
    justifyContent: "center",
  },
  gridItem: {
    flexBasis: "0%",
  },
  noPhotos: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "15px",
  },
});

export const Entries = () => {
  const classes = useStyles();
  const [submissions, setSubmissions] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    let isSubscribed = true;
    axiosPath
      .get("/profiles")
      .then((res) => {
        if (isSubscribed) {
          setSubmissions(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => (isSubscribed = false);
  }, [update, submissions]);

  if (submissions.length > 0) {
    return (
      <>
        <Grid container spacing={5} className={classes.gridContainer} justify="center">
          {submissions.map(({ first, last, email, fileId, filename, _id, description, originalName }, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={_id} className={classes.gridItem}>
                <Entry
                  index={index}
                  update={update}
                  setUpdate={setUpdate}
                  key={_id}
                  first={first}
                  last={last}
                  email={email}
                  fileId={fileId}
                  filename={filename}
                  photo={`http://localhost:4000/profile/${filename}`}
                  _id={_id}
                  description={description}
                  originalName={originalName}
                />
              </Grid>
            );
          })}
        </Grid>
      </>
    );
  } else {
    return (
      <>
        <Typography className={classes.noPhotos}>No Entries made, please make one</Typography>
        <NewForm />
      </>
    );
  }
};
