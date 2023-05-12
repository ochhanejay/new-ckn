require("dotenv").config({ path: "./config.env" });
const app = require("./index");
const mongoose = require("mongoose");
const axios = require('axios');
const responseTime = require('response-time');
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const { swaggerServe, swaggerSetup } = require('./configSwagger')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connection successful!"))
  .catch((error) => console.log(error));

cron.schedule("59 34 18 * * *", function () {
  // axios.put(`https://chai-ke.onrender.com/api/deleteCounterNumber`) ;
  console.log("time", "11");
});
app.use("/api-docs", swaggerServe, swaggerSetup);
app.use(responseTime());
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server is runnning at port ${port}!`));


