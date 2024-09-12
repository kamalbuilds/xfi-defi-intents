import express, { Request, Response, Application } from "express";
import cors from "cors";
import { env } from "./env";
import { brianRouter } from "./routes/brian";
import { txRouter } from "./routes/tx";
import { zerionRounter } from "./routes/zerion";

const app: Application = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const port = env.PORT;

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

app.use("/brian", brianRouter);
app.use("/tx", txRouter);
app.use("/zerion", zerionRounter);

app.listen(port, () => {
  console.log(`Server is live at port ${port}`);
});
