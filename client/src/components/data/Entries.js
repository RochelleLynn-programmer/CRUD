import React, { useState, useEffect } from "react";
import axiosPath from "../../axios";
import { Entry } from "./Entry";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  gridContainer: {
    paddingTop: "20px",
    paddingLeft: "30px",
    paddingRight: "30px",
  },
});

export const Entries = () => {
  const classes = useStyles();
  const [submissions, setSubmissions] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    axiosPath
      .get("/profiles")
      .then((res) => {
        setSubmissions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [update]);

  return (
    <>
      <Grid container spacing={5} className={classes.gridContainer} justify="center">
        {submissions.map(({ first, last, email, fileId, filename, _id, description, originalName, number }, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={_id}>
              <Entry
                index={index}
                update={update}
                setUpdate={setUpdate}
                key={_id}
                first={first}
                last={last}
                email={email}
                number={number}
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
};
