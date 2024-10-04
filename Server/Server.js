require('dotenv').config();
const express = require('express');
const parseCookie = require("cookie-parser");
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require("./routes/auth")
const taskRouter = require("./routes/task")
const { Auth } = require('./middleware/Auth');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_DB = process.env.MONGO_DB;

app.use(express.json());
app.use(parseCookie())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/auth', authRouter);
app.use('/task', Auth, taskRouter);


mongoose
  .connect(MONGO_DB)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to Database:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
