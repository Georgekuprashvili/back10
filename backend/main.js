const express = require("express");
const { apiRouter } = require("./api/index");
const { upload } = require("./config/cloudinary.config");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.post("/upload", upload.single("image"), (req, res) => {
  res.status(201).json({
    message: "uploaded successfully",
    url: req.file.path,
  });
});



app.listen(4000, () => {
  console.log(" Server running on http://localhost:4000");
});
