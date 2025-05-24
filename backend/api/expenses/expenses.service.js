const { deleteFromCloudinary } = require("../../config/cloudinary.config");
const { readFile, writeFile } = require("../../utils");

const getAllExpenses = async (req, res) => {
  let page = Number(req.query.page) || 1;
  let take = Number(req.query.take) || 30;

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

  const { category, price } = req.body;

  const newexpense = {
    id: lasid + 1,
    category,
    price,
    createdat: new Date().toISOString(),
    image: req.file.path,
    imageId: req.file.filename,
  };

  expenses.push(newexpense);
  await writeFile("expenses.json", JSON.stringify(expenses));

  res.redirect("/");
};

const updateExpense = async (req, res) => {
  const id = Number(req.params.id);
  const { category, price } = req.body;
  const expenses = await readFile("expenses.json", true);
  const index = expenses.findIndex((el) => el.id === id);
  if (index === -1) {
    res.status(404).json({ error: "expense not found" });
  }

  const existing = expenses[index];

  if (req.file) {
    if (existing.imageId) {
      await deleteFromCloudinary(existing.imageId);
    }

    existing.image = req.file.path;
    existing.imageId = req.file.filename;
  }

  existing.category = category || existing.category;
  existing.price = price || existing.price;

  expenses[index] = existing;
  await writeFile("expenses.json", JSON.stringify(expenses));
  res.redirect("/");
};

const deleteExpense = async (req, res) => {
  const id = Number(req.params.id);
  const expenses = await readFile("expenses.json", true);
  const index = expenses.findIndex((el) => el.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "expense not found" });
  }

  const imageId = expenses[index].imageId;
  if (imageId) {
    await deleteFromCloudinary(imageId);
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
