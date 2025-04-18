import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connect() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/nextAuth`);
    const connection = mongoose.connection;

    if (connection.readyState >= 1) {
      console.log("Already connected to DB");
    }

    connection.on("connected", () => {
      console.log("Database connected succesfully");
    });
    connection.on("error", (err) => {
      console.log("Error while connecting to Database:", err);
    });
  } catch (error) {
    console.log("Something went wrong");
    console.log(error);
  }
}
