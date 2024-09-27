import AWS from "aws-sdk";
import AWSCredentials from "../config/credentials";

const tableName = "humidity_historic"

AWS.config.update(AWSCredentials.AwsConfig);

const dynamodb = new AWS.DynamoDB.DocumentClient();

type SensorLocalization = {
    address: number;
    chip: number;
}

type SensorInformations = {
    chip: number;
    address: number;
    humidity: number;
    temperature: number;
}

const findHumidityAt = async ({ address, chip }: SensorLocalization) => {
    const params = {
        TableName: tableName,
        Key: {
            chip,
            address
        }
    }

    try {
        const response = await dynamodb.get(params).promise();
        return response.Item;
    } catch (error) {
        const err = error as AWS.AWSError;
        throw new Error("Não foi possível coletar dados da umidade: " + err);
    }
};

const appendHumidity = async ({ address, humidity, chip, temperature }: SensorInformations) => {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: {
            chip,
            address,
            humidity,
            temperature,
        }
    };
    try {
        const response = await dynamodb.put(params).promise();
        return response;
    } catch (error) {
        const err = error as AWS.AWSError;
        throw new Error("Não foi possível adicionar o novo item a tabela: " + err);
    }
}

export default {
    findHumidityAt,
    appendHumidity,
};