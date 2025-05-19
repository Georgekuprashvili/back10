const randomblock = (req, res, next) => {
  const block = Math.random() < 0.5;

  if (block) {
    return res.status(401).json({ error: "blocked randomly" });
  }
  next();
};
module.exports = { randomblock };
