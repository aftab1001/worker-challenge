import axios from 'axios';
import { Logger } from '../../helpers/Logger';
import { AppConfiguration } from '../../config/AppConfiguration';

export class ApiClient {
    async collectData(workerId: number): Promise<number[]> {
        const port = AppConfiguration.WorkerStartingPort + workerId;
        const url = `${AppConfiguration.WorkerStartingEndPointUrl}:${port}/rnd?n=${AppConfiguration.SamplePerWorker}`;

        try {
            const response = await axios.get(url);
            return response.data
                .split('\n')
                .filter((line: string) => line.trim().length > 0)
                .map((line: string) => +line.replace(/^\D+/g, ''));
        } catch (err) {
            Logger.error(`Error collecting data from worker: ${err}`);
            return [];
        }
    }
}
