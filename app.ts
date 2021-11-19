import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";

import userRoute from "./routes/userRoute";
import cartRoute from "./routes/cartRoute";
import productRoute from "./routes/productRoute";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: any, res: any, next: any) => {
  res.locals.session = req.session;
  next();
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);

mongoose
  .connect(process.env.URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    const port = process.env.PORT || 1456;
    app.listen(port, () => console.log(`listening on port ${port}`));
  })
  .catch((err) => {
    console.log(err);
  });
