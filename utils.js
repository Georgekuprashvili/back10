const fs = require("fs/promises");

const readFile = async (filepath, parse) => {
  if (!filepath) return;
  const data = await fs.readFile(filepath, "utf-8");
  return parse ? JSON.parse(data) : data;
};

const writeFile = async (filepath, data) => {
  if (!filepath) return;

  await fs.writeFile(filepath, data);
};
module.exports = {
  writeFile,
  readFile,
};
