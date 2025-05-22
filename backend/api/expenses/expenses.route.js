const { Router } = require("express");

const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require(".././expenses/expenses.service");
const { check, validation } = require("../../middlewares/expenses.middleware");
const { upload } = require("../../config/cloudinary.config");

const router = Router();

router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.post("/", upload.single("image"), validation, createExpense);
router.put("/:id", upload.single("image"), validation, updateExpense);
router.delete("/:id", check, deleteExpense);

module.exports = router;
