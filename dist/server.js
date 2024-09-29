"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HumidityHistoricRoute_1 = __importDefault(require("./router/HumidityHistoricRoute"));
const dotenv_safe_1 = require("dotenv-safe");
(0, dotenv_safe_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(HumidityHistoricRoute_1.default);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening to requests on PORT ${port}`);
});
