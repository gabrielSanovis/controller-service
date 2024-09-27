import express from "express";
import humidityRouter from "./router/HumidityHistoricRoute";

const app = express();

app.use(express.json());

app.use(humidityRouter);

const port = 3000;
const IPv4 = "YOUR_IPV4"
app.listen(port, IPv4, () => {
    console.log(`Listening to requests on http://${IPv4}:${port}`);
});
