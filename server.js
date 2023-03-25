const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require("cors");
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require("compression");

dotenv.config({ path: "config.env" });
const dbConnecion = require("./config/database");
const mountRoutes = require("./routes");
const globalError = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/apiError");
const { webhookCheckout } = require("./services/orderServices");
//connect db
dbConnecion();
//express app
const app = express();
app.use(cors());
app.options("*", cors());

app.use(compression());
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//json
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

//Routes
// eslint-disable-next-line eqeqeq
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

//Mount Route
mountRoutes(app);
app.all("*", (req, res, next) => {
  //create and send error to error middlware handling
  // const err = new Error(`can't find this url : ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`cant find this route : ${req.originalUrl}`, 400));
});

//global error handling middlware for express
app.use(globalError);

const { PORT } = process.env;

const server = app.listen(PORT, () => {
  console.log(`App running ON PORT ${PORT}`);
});

//handle error outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`shutting down ...`);
    process.exit(1);
  });
});
