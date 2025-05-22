const { Router } = require("express");
const expensesRoute = require("./expenses/expenses.route");
const { randomblock } = require("../middlewares/random.middleware");
const apiRouter = Router();
const randomRoute = require("./random/random.route");

apiRouter.use("/expenses", expensesRoute);
apiRouter.use("/random", randomRoute);

module.exports = { apiRouter };
