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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const credentials_1 = __importDefault(require("../config/credentials"));
const tableName = "humidity_historic";
aws_sdk_1.default.config.update(credentials_1.default.AwsConfig);
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const findHumidityAt = (_a) => __awaiter(void 0, [_a], void 0, function* ({ address, chip }) {
    const params = {
        TableName: tableName,
        Key: {
            chip,
            address
        }
    };
    try {
        const response = yield dynamodb.get(params).promise();
        return response.Item;
    }
    catch (error) {
        const err = error;
        throw new Error("Não foi possível coletar dados da umidade: " + err);
    }
});
const appendHumidity = (_a) => __awaiter(void 0, [_a], void 0, function* ({ address, humidity, chip, temperature }) {
    const params = {
        TableName: tableName,
        Item: {
            chip,
            address,
            humidity,
            temperature,
        }
    };
    try {
        const response = yield dynamodb.put(params).promise();
        return response;
    }
    catch (error) {
        const err = error;
        throw new Error("Não foi possível adicionar o novo item a tabela: " + err);
    }
});
exports.default = {
    findHumidityAt,
    appendHumidity,
};
