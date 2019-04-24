import { connect, connection } from "mongoose";

type TInput = {
  db: string;
};
export default function({ db }: TInput): any {
  const connectFun = () => {
    connect(
      db,
      {
        useCreateIndex: true,
        useNewUrlParser: true
      }
    )
      .then(() => {
        return console.info(`Successfully connected to ${db}`);
      })
      .catch(error => {
        console.log(`url wrong ${db}`);
        console.error("Error connecting to database: ", error);
        return process.exit(1);
      });
  };
  connectFun();

  connection.on("disconnected", connectFun);
}
