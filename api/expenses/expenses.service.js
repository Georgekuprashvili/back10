const { readFile, writeFile } = require("../../utils");

const getAllExpenses = async (req, res) => {
  let page = Number(query.page) || 1;
  let take = Number(query.take) || 30;
  take = Math.min(30, take);
  const start = (page - 1) * take;
  const end = page * take;
  const expenses = await readFile("expenses.json", true);
  if (!req.query.page && !req.query.take) {
    return res.json(expenses);
  }

  res.json({
    total: expenses.length,
    page,
    take,
    data: expenses.slice(start, end),
  });
};

const getExpenseById = async (req, res) => {
  const id = Number(req.params.id);
  const expenses = await readFile("expenses.json", true);
  const expense = expenses.find((el) => el.id === id);

  if (!expense) {
    return res.status(404).json({ error: "expense not found" });
  }
  res.json(expense);
};

const createExpense = async (req, res) => {
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
};

const updateExpense = async (req, res) => {
  const id = Number(req.params.id);
  const { category, price } = req.body;
  const expenses = await readFile("expenses.json", true);
  const index = expenses.findIndex((el) => el.id === id);
  if (index === -1) {
    res.status(404).json({ error: "expense not found" });
  }

  expenses[index] = {
    ...expenses[index],
    category: category || expenses[index].category,
    price: price || expenses[index].price,
  };
  await writeFile("expenses.json", JSON.stringify(expenses));
  res.json({ message: "expense updated", data: expenses[index] });
};

const deleteExpense = async (req, res) => {
  const id = Number(req.params.id);
  const expenses = await readFile("expenses.json", true);
  const index = expenses.findIndex((el) => el.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "expense not found" });
  }

  const deleted = expenses.splice(index, 1);
  await writeFile("expenses.json", JSON.stringify(expenses));
  res.json({ message: "expense deleted", data: deleted[0] });
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  deleteExpense,
  updateExpense,
};
