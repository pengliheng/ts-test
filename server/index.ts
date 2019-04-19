import * as express from "express";
require("dotenv").config();
import * as cors from "cors";

import connect from "./connect";
import user from "./user/router";
import config from "../config/index";
const PORT = process.env.NODE_PORT || 3000;
const app = express();
app.use(cors());

user(app);
app.use("*", async (_: any, res: any) => {
  res.send("404");
});

app.listen(PORT, () => {
  console.log(`success listen ${PORT}`);
  connect({ db: config.db });
});
