import { config } from "dotenv-safe";
config();
export default {
    AwsConfig: {
        region: process.env.REGION,
        endpoint: `http://dynamodb.${process.env.REGION}.amazonaws.com`,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
};