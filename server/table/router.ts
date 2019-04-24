import Table from "./model";
import { connection } from "mongoose";

export default function user(app: any) {
  app.use("/table/:table/create", async (req: any, res: any) => {
    Table(req.params.table)
      .create({
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        email: req.query.email
      })
      .then((data: any) => {
        res.send({
          success: true,
          data
        });
        return data;
      })
      .catch((error: Error) => {
        res.send({
          success: false,
          data: error
        });
        return error;
      });
  });
  app.use("/table/:table/get", async (req: any, res: any) => {
    Table(req.params.table)
    .find({})
    .then((data: any[]) => {
      res.send({
          success: true,
          data
        });
        return data;
      })
      .catch((error: Error) => {
        res.send({
          success: false,
          data: error
        });
        return error;
      });
  });
  app.use("/table/:table/delete/:id", async (req: any, res: any) => {
    Table(req.params.table)
      .findOneAndDelete({ _id: req.params.id })
      .then((data: any) => {
        if (data) {
          res.send({
            success: true
          });
        } else {
          res.send({
            success: false
          });
        }
      });
  });
  app.use("/table/:table/update/:id", async (req: any, res: any) => {
    Table(req.params.table)
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          firstName: req.query.firstName,
          lastName: req.query.lastName,
          email: req.query.email
        }
      )
      .then((data: any) => {
        res.send({
          success: true,
          data: data
        });
      })
      .catch((error: Error) => {
        res.send({
          success: false,
          data: error
        });
      });
  });

  app.use("/db/get", async (_: any, res: any) => {
    console.log('names');
    connection.db.listCollections().toArray(async (_: any, names: any) => {
      res.send({
        success: true,
        data: names
      });
    });
  });

}
