import { Request, Response, Router } from "express";
import humidityHistoricDB from "../database/HumidityHistoricDB";

const route = Router();

type SensorInformations = {
    address: number;
    humidity: number;
    temperature: number;
    chip: number;
}

route.get("/address/:address/chip/:chip", async (req: Request, res: Response) => {
    const { address, chip } = req.params
    try {
        const dto = await humidityHistoricDB.findHumidityAt({ address: Number(address), chip: Number(chip) });
        if (dto?.humidity < 50) {
            return res.status(200).json({ message: "Umidade baixa", turnOn: true, humidity: dto?.humidity });
        }
        return res.status(200).json({ message: dto?.humidity > 60 ? "Umidade alta CUIDADO" : "Umidade Normal", turnOn: false, humidity: dto?.humidity });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

route.post("/", async (req: Request, res: Response) => {
    const { address, humidity, temperature, chip }: SensorInformations = req.body;
    try {
        await humidityHistoricDB.appendHumidity({ address, humidity, temperature, chip });
        res.status(200).json({ message: "umidade altera com sucesso", humidity: humidity });
    } catch (error) {
        res.status(500).json({ message: "Erro ao alterar a umidade", humidity: humidity });
    }
})


export default route;