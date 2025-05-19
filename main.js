const express = require("express");
const { apiRouter } = require("./api/index");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.listen(4000, () => {
  console.log(" Server running on http://localhost:4000");
});
