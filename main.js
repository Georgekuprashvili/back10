const express = require("express");
const { readFile, writeFile } = require("./utils");
const app = express();
app.use(express.json());

const key = "random123";
app.get("/api/expenses", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const take = parseInt(req.query.take) || 30;

  const expenses = await readFile("expenses.json", true);
  if (!req.query.page && !req.query.take) {
    return res.json(expenses);
  }

  const start = (page - 1) * take;
  const paginated = expenses.slice(start, start + take);

  res.json({
    total: expenses.length,
    page,
    take,
    data: paginated,
  });
});

app.post("/api/expenses", async (req, res) => {
  const { category, price } = req.body;

  if (!category || typeof price !== "number") {
    return res
      .status(400)
      .json({ error: "Category and valid price are required" });
  }

  const expenses = await readFile("expenses.json", true);
  const lasid = expenses[expenses.length - 1]?.id || 0;

  const newexpense = {
    id: lasid + 1,
    category,
    price,
    createdat: new Date().toISOString(),
  };

  expenses.push(newexpense);
  await writeFile("expenses.json", JSON.stringify(expenses));

  res.status(200).json({ message: "expense created", data: newexpense });
});

app.get("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);
  const expenses = await readFile("expenses.json", true);
  const expense = expenses.find((el) => el.id === id);

  if (!expense) {
    return res.status(404).json({ error: "expense not found" });
  }
  res.json(expense);
});

app.delete("/api/expenses/:id", async (req, res) => {
  const secret = req.headers["secret"];
  if (secret !== key) {
    return res.status(400).json({ error: "invalid secret key" });
  }

  const id = Number(req.params.id);
  const expenses = await readFile("expenses.json", true);
  const index = expenses.findIndex((el) => el.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "expense not found" });
  }

  const deleted = expenses.splice(index, 1);
  await writeFile("expenses.json", JSON.stringify(expenses));
  res.json({ message: "expense deleted", data: deleted[0] });
});

app.put("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { category, price } = req.body;
  const expenses = await readFile("expenses.json", true);
  const index = expenses.findIndex((el) => el.id === id);
  if (index === -1) {
    res.status(404).json({ error: "expense not found" });
  }
  if (!category || typeof price !== "number") {
    return res
      .status(400)
      .json({ error: "Category and valid price are required" });
  }
  expenses[index] = {
    ...expenses[index],
    category: category || expenses[index].category,
    price: price || expenses[index].price,
  };
  await writeFile("expenses.json", JSON.stringify(expenses));
  res.json({ message: "expense updated", data: expenses[index] });
});

app.listen(4000, () => {
  console.log(" Server running on http://localhost:4000");
});
