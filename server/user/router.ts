import User, { IUser } from "./model";

export default function user(app: any) {
  app.use("/user/create", async (req: any, res: any) => {
    User.create({
      firstName: req.query.firstName,
      lastName: req.query.lastName,
      email: req.query.email
    })
      .then((data: IUser) => {
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
  app.use("/user/get", async (_: any, res: any) => {
    User.find({})
      .then((data: IUser[]) => {
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
  app.use("/user/delete/:id", async (req: any, res: any) => {
    User.findOneAndDelete({ _id: req.params.id }).then((data: any) => {
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
  app.use("/user/update/:id", async (req: any, res: any) => {
    User.findOneAndUpdate(
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
}
