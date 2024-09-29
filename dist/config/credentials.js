"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_safe_1 = require("dotenv-safe");
(0, dotenv_safe_1.config)();
exports.default = {
    AwsConfig: {
        region: process.env.REGION,
        endpoint: `http://dynamodb.${process.env.REGION}.amazonaws.com`,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
};
