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
const tableName = "historic";
aws_sdk_1.default.config.update(credentials_1.default.AwsConfig);
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const dateHours = () => {
    const date = new Date();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    return `${day}/${month}/${date.getFullYear()}:${hour}:${minutes}`;
};
const appendHistoric = (_a) => __awaiter(void 0, [_a], void 0, function* ({ chip, temperature, humidity }) {
    const params = {
        TableName: tableName,
        Item: {
            chip,
            date_hour: dateHours(),
            dht_info: {
                temperature,
                humidity
            }
        }
    };
    try {
        const response = yield dynamodb.put(params).promise();
        return response;
    }
    catch (error) {
        const err = error;
        throw new Error("Não foi possível salvar no historico: " + err);
    }
});
const findAllHistoric = (chip) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: tableName,
        ExpressionAttributeValues: {
            ":c": chip,
        },
        KeyConditionExpression: "chip = :c",
    };
    try {
        const response = yield dynamodb.query(params).promise();
        return response;
    }
    catch (error) {
        const err = error;
        throw new Error("Não foi possível coletar o historico: " + err);
    }
});
exports.default = {
    appendHistoric,
    findAllHistoric,
};
