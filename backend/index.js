const express = require("express");
const app = express();
const PORT = 8000;

app.listen(PORT, (req, res) => {
  console.log(`Server is running on ${PORT}`);
});
