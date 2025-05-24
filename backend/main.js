const express = require("express");
const path = require("path");
const { upload } = require("./config/cloudinary.config");
const { apiRouter } = require("./api/index");
const expensesRoutes = require("./api/expenses/expenses.route");
const { readFile } = require("./utils");

const app = express();
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api", apiRouter);

app.post("/upload", upload.single("image"), (req, res) => {
  res.status(201).json({
    message: "uploaded successfully",
    url: req.file.path,
  });
});

app.get("/", async (req, res) => {
  const expenses = await readFile("expenses.json", true);
  res.render("expenses/index", { expenses });
});

app.get("/expenses/create", (req, res) => {
  res.render("expenses/create");
});

app.get("/expenses/:id", async (req, res) => {
  const expenses = await readFile("expenses.json", true);
  const expense = expenses.find((e) => e.id === Number(req.params.id));
  res.render("expenses/detail", { expense });
});

app.get("/expenses/update/:id", async (req, res) => {
  const expenses = await readFile("expenses.json", true);
  const expense = expenses.find((e) => e.id === Number(req.params.id));
  res.render("expenses/update", { expense });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
