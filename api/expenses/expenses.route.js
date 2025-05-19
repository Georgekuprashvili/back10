const { Router } = require("express");

const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require(".././expenses/expenses.service");
const { check, validation } = require("../../middlewares/expenses.middleware");

const router = Router();

router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.post("/", validation, createExpense);
router.put("/:id", validation, updateExpense);
router.delete("/:id", check, deleteExpense);

module.exports = router;
