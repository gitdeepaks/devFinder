const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

// Routes
const authRouter = require("./routes/auth.routes");
const profileRouter = require("./routes/profile.routes");
const requestsRouter = require("./routes/requests.routes");

const app = express();

const PORT = process.env.PORT || 4111;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
