require("dotenv").config();
import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import crypto from "crypto";

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//url to monggo database
const mongoURL = process.env.MONGO_URL;

//connect to the database
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

//create a connection for gfs
const conn = mongoose.createConnection(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;
//starts stream
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("profiles");
});

//multer/gfs storage for file upload
const storage = new GridFsStorage({
  url: mongoURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "profiles",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

const ProfileSchema = new mongoose.Schema({
  first: {
    required: true,
    type: String,
  },
  last: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  originalName: {
    required: true,
    type: String,
  },
  filename: {
    required: true,
    type: String,
  },
  fileId: {
    required: true,
    type: String,
  },
});

const UserProfile = mongoose.model("UserProfiles", ProfileSchema);

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/profiles", async (req, res) => {
  try {
    const profiles = await UserProfile.find();
    res.json(profiles);
  } catch (err) {
    res.send("error: ", err);
  }
});

app.get("/oneprofile/:id", async (req, res) => {
  try {
    const profile = await UserProfile.find({ _id: req.params.id });
    res.json(profile);
  } catch (err) {
    res.send("error: ", err);
  }
});

app.get("/files", async (req, res) => {
  try {
    await gfs.files.find().toArray((err, files) => {
      return res.json(files);
    });
  } catch (err) {
    console.log("error: ", err);
  }
});

app.get("/profile/:filename", async (req, res) => {
  try {
    await gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (!file) {
        return res.json({ err: "unable to get photo" });
      }
      if (file.contentType === "image/jpeg" || file.contentType === "image/png" || file.contentType === "image/jpg") {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.send("error: ", err);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/uploadForm", upload.single("photo"), async (req, res) => {
  try {
    const newProfile = await new UserProfile({
      first: req.body.first,
      last: req.body.last,
      email: req.body.email,
      description: req.body.description,
      originalName: req.file.originalname,
      filename: req.file.filename,
      fileId: req.file.id,
    });
    newProfile.save();
    res.send("Successfully uploaded form");
  } catch (err) {
    console.log(err);
    res.send("error: ", err);
  }
});

app.delete("/deleteprofile/:id", async (req, res) => {
  try {
    await UserProfile.findByIdAndDelete({ _id: req.params.id });
    res.status(200).send("Successfully deleted");
  } catch (err) {
    res.status(419).json({ "line 152: ": err });
  }
});

app.delete("/deletepic/:filename", async (req, res) => {
  try {
    await gfs.remove({ filename: req.params.filename, root: "profiles" }, (err, GridFSBucket) => {
      if (err) {
        return res.status(418).json({ "line 159: ": err });
      }
      res.send("Success");
    });
  } catch (err) {
    res.json({ "line 162: ": err });
  }
});

app.patch("/updateData/:id", async (req, res) => {
  console.log("entered server route");
  try {
    const update = req.body;
    await UserProfile.findByIdAndUpdate(
      { _id: req.params.id },
      {
        first: update.first,
        last: update.last,
        email: update.email,
        description: update.description,
        originalName: update.originalName,
      },
    );
    res.status(200).send("successly updated");
  } catch (err) {
    res.send(err);
  }
});

app.patch("/updatePic/:id", async (req, res) => {
  try {
    const update = req.body;
    await UserProfile.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { originalName: update.originalName, filename: update.filename, fileId: update.fileId },
    );
    res.send("success");
  } catch (err) {
    res.json({ err: err });
  }
});

app.patch("/updateBoth/:id", async (req, res) => {
  try {
    const update = req.body;
    await UserProfile.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        first: update.first,
        last: update.last,
        email: update.email,
        description: update.description,
        originalName: update.originalName,
        filename: update.filename,
        fileId: update.fileId,
      },
    );
    res.send("success");
  } catch (err) {
    res.json({ err: err });
  }
});

app.post("/uploadPic", upload.single("photo"), async (req, res) => {
  res.json({ filename: req.file.filename, fileId: req.file.id, originalName: req.file.originalname });
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
