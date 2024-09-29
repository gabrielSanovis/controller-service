import AWS from "aws-sdk";
import AWSCredentials from "../config/credentials";

type HistoricTelemetry = { chip: string, temperature: string, humidity: string }

const tableName = "historic"

AWS.config.update(AWSCredentials.AwsConfig);

const dynamodb = new AWS.DynamoDB.DocumentClient();

const dateHours = () => {
    const date = new Date();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
    return `${day}/${month}/${date.getFullYear()}:${hour}:${minutes}`;
};

const appendHistoric = async ({ chip, temperature, humidity }: HistoricTelemetry) => {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
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
        const response = await dynamodb.put(params).promise();
        return response;
    } catch (error) {
        const err = error as AWS.AWSError;
        throw new Error("Não foi possível salvar no historico: " + err);
    }
}

const findAllHistoric = async (chip: string) => {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        ExpressionAttributeValues: {
            ":c": chip,
        },
        KeyConditionExpression: "chip = :c",
    };
    try {
        const response = await dynamodb.query(params).promise();
        return response;
    } catch (error) {
        const err = error as AWS.AWSError;
        throw new Error("Não foi possível coletar o historico: " + err);
    }
}

export default {
    appendHistoric,
    findAllHistoric,
}