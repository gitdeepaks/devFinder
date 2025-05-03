const express = require("express");

const app = express();

const PORT = process.env.PORT || 4111;

app.get("/user/:userId/:name/:password", (req, res) => {
  res.send(
    `User ID is ${req.params.userId} and name is ${req.params.name} and password is ${req.params.password}`
  );
});

app.get("/user", (req, res) => {
  res.send({
    name: "John",
    age: 20,
    city: "New York",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
