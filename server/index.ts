import * as express from "express";
import * as cors from "cors";
import connect from "./connect";
import user from "./table/router";
import config from "../config/index";
const PORT = process.env.NODE_PORT || 3000;
const app = express();
require("dotenv").config();
app.use(cors());

// if (process.env.NODE_NEV === "DEVELOPMENT") {
//   app.use((__: any, _: any, next: any) => {
//     setTimeout(() => {
//       next();
//     }, 300);
//   });
// }

user(app);
app.use("*", async (_: any, res: any) => {
  res.send("404");
});

app.listen(PORT, () => {
  console.log(`success listen ${PORT}`);
  connect({ db: config.db });
});
