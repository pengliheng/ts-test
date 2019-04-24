import * as express from "express";
import * as cors from "cors";
import connect from "./connect";
import user from "./table/router";
// import config from "../config/index";
const NODE_PORT = process.env.NODE_PORT || "3000";
const MONGO_PORT = process.env.MONGO_URI || "mongodb://mongodb:27017/local";
const app = express();

// require("dotenv").config();
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

app.listen(NODE_PORT, () => {
  console.log(`success listen ${NODE_PORT}`);
  connect({ db: MONGO_PORT });
});
