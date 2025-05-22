const check = (req, res, next) => {
  const secret = req.headers["secret"];
  if (secret !== "secret") {
    return res.status(401).json({ error: "ivalid key" });
  }
  next();
};

const validation = (req, res, next) => {
  const { category, price } = req.body;
  if (!category || !price || isNaN(Number(price))) {
    return res.status(400).json({ error: "category and  price are required" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "image is required" });
  }

  next();
};

module.exports = { check, validation };
