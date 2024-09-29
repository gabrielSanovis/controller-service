import express from "express";
import humidityRouter from "./router/HumidityHistoricRoute";
import { config } from "dotenv-safe";
config();

const app = express();

app.use(express.json());

app.use(humidityRouter);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening to requests on PORT ${port}`);
});
