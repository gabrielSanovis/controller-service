"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HumidityHistoricDB_1 = __importDefault(require("../database/HumidityHistoricDB"));
const HistoricDB_1 = __importDefault(require("../database/HistoricDB"));
const route = (0, express_1.Router)();
route.get("/address/:address/chip/:chip", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, chip } = req.params;
    try {
        const dto = yield HumidityHistoricDB_1.default.findHumidityAt({ address: Number(address), chip: Number(chip) });
        if ((dto === null || dto === void 0 ? void 0 : dto.humidity) < 50) {
            return res.status(200).json({ message: "Umidade baixa", turnOn: true, humidity: dto === null || dto === void 0 ? void 0 : dto.humidity });
        }
        return res.status(200).json({ message: (dto === null || dto === void 0 ? void 0 : dto.humidity) > 60 ? "Umidade alta CUIDADO" : "Umidade Normal", turnOn: false, humidity: dto === null || dto === void 0 ? void 0 : dto.humidity });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
}));
route.get("/historic/chip/:chip", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chip } = req.params;
    try {
        const dto = yield HistoricDB_1.default.findAllHistoric(chip);
        return res.status(200).json({ data: dto });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
}));
route.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, humidity, temperature, chip } = req.body;
    try {
        yield HumidityHistoricDB_1.default.appendHumidity({ address, humidity, temperature, chip });
        yield HistoricDB_1.default.appendHistoric({ chip: String(chip), humidity: String(humidity), temperature: String(temperature) });
        res.status(200).json({ message: "umidade altera com sucesso", humidity: humidity });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao alterar a umidade", humidity: humidity });
    }
}));
exports.default = route;
