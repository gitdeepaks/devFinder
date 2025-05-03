const express = require("express");

const app = express();

const PORT = process.env.PORT || 4111;

app.use("/hello", (req, res) => {
  res.send("Hello hello");
});

app.use("/test", (req, res) => {
  res.send("Hello World from server");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
